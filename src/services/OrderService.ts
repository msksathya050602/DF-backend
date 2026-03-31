import { Between, Not } from 'typeorm';

import { dbSource } from '@/dbConfig';
import { Branch } from '@/entities/Branch';
import { Customer } from '@/entities/Customer';
import { Order, OrderStatus, PaymentStatus } from '@/entities/Order';
import { OrderItem, OrderItemStatus } from '@/entities/OrderItem';
import { Pricing } from '@/entities/Pricing';

type CreateOrderItemInput = {
    productId: string;
    serviceId: string;
    quantity: number;
    remarks?: string;
};

export type CreateOrderInput = {
    customerId: string;
    branchId: string;
    /** User id (uuid) of staff who created / owns the order; stored as `Order.handledBy` text. */
    handledByUserId?: string;
    items: CreateOrderItemInput[];
    discountAmount?: number;
    taxAmount?: number;
    pickupDate?: string;
    /** Stored as `Order.deliveryDate`; alias for API clarity */
    deliveryDate?: string;
    expectedDeliveryDate?: string;
    notes?: string;
};

const round2 = (value: number | string | undefined | null): number => Number(Number(value ?? 0).toFixed(2));

const generateOrderNumber = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const t = String(now.getTime()).slice(-6);
    return `ORD-${y}${m}${d}-${t}`;
};

export class OrderService {
    static async getAllOrders(): Promise<Order[]> {
        return Order.find({
            where: { isActive: true },
            relations: ['customer', 'branch', 'items', 'items.product', 'items.product.category', 'items.service'],
            order: { createdAt: 'DESC' },
        });
    }

    static async getOrderById(id: string): Promise<Order | null> {
        return Order.findOne({
            where: { id },
            relations: ['customer', 'branch', 'items', 'items.product', 'items.product.category', 'items.service'],
        });
    }

    static async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
        return Order.find({
            where: { customerId, isActive: true },
            relations: ['customer', 'branch', 'items', 'items.product', 'items.product.category', 'items.service'],
            order: { createdAt: 'DESC' },
        });
    }

    /** Active orders with `deliveryDate` on the current calendar day (server local time), excluding cancelled. */
    static async getTodayDeliveryOrders(): Promise<Order[]> {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        return Order.find({
            where: {
                isActive: true,
                deliveryDate: Between(start, end),
                orderStatus: Not(OrderStatus.CANCELLED),
            },
            relations: ['customer', 'branch', 'items', 'items.product', 'items.product.category', 'items.service'],
            order: { deliveryDate: 'ASC', createdAt: 'DESC' },
        });
    }

    static async createOrder(data: CreateOrderInput): Promise<Order> {
        if (!Array.isArray(data.items) || data.items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        const createdOrder = await dbSource.transaction(async manager => {
            const customer = await manager.findOne(Customer, {
                where: { id: data.customerId, isActive: true },
            });
            if (!customer) {
                throw new Error('Customer not found');
            }

            const branch = await manager.findOne(Branch, {
                where: { id: data.branchId, isActive: true },
            });
            if (!branch) {
                throw new Error('Branch not found');
            }

            const order = manager.create(Order, {
                orderNumber: generateOrderNumber(),
                customerId: data.customerId,
                branchId: data.branchId,
                handledBy: data.handledByUserId,
                orderStatus: OrderStatus.CREATED,
                paymentStatus: PaymentStatus.PENDING,
                subTotal: 0,
                discountAmount: round2(Math.max(0, Number(data.discountAmount) || 0)),
                taxAmount: round2(Math.max(0, Number(data.taxAmount) || 0)),
                totalAmount: 0,
                pickupDate: data.pickupDate?.trim() ? new Date(data.pickupDate) : undefined,
                deliveryDate: (() => {
                    const raw = (data.expectedDeliveryDate ?? data.deliveryDate)?.trim();
                    return raw ? new Date(raw) : undefined;
                })(),
                notes: data.notes,
                isActive: true,
            });

            const savedOrder = await manager.save(order);

            let subTotal = 0;

            for (const item of data.items) {
                if (!item.productId || !item.serviceId || !Number.isFinite(item.quantity) || item.quantity <= 0) {
                    throw new Error('Invalid order item payload');
                }

                const pricing = await manager.findOne(Pricing, {
                    where: {
                        productId: item.productId,
                        serviceId: item.serviceId,
                        isActive: true,
                    },
                });
                if (!pricing) {
                    throw new Error(`Pricing not found for product ${item.productId} and service ${item.serviceId}`);
                }

                const unitPrice = round2(pricing.price);
                const lineTotal = round2(unitPrice * Number(item.quantity));
                subTotal += lineTotal;

                const orderItem = manager.create(OrderItem, {
                    orderId: savedOrder.id,
                    productId: item.productId,
                    serviceId: item.serviceId,
                    quantity: item.quantity,
                    unitPrice,
                    lineTotal,
                    itemStatus: OrderItemStatus.RECEIVED,
                    remarks: item.remarks,
                });
                await manager.save(orderItem);
            }

            savedOrder.subTotal = round2(subTotal);
            savedOrder.totalAmount = round2(subTotal - Number(savedOrder.discountAmount) + Number(savedOrder.taxAmount));
            await manager.save(savedOrder);

            return savedOrder;
        });

        const orderWithRelations = await this.getOrderById(createdOrder.id);
        if (!orderWithRelations) {
            throw new Error('Failed to load created order');
        }
        return orderWithRelations;
    }

    static async updateOrderStatus(id: string, orderStatus: OrderStatus): Promise<Order | null> {
        const order = await this.getOrderById(id);
        if (!order) return null;
        order.orderStatus = orderStatus;
        await order.save();
        return this.getOrderById(id);
    }

    static async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order | null> {
        const order = await this.getOrderById(id);
        if (!order) return null;
        order.paymentStatus = paymentStatus;
        await order.save();
        return this.getOrderById(id);
    }

    static async updateOrderItemStatus(id: string, itemStatus: OrderItemStatus): Promise<OrderItem | null> {
        const item = await OrderItem.findOne({
            where: { id },
            relations: ['product', 'service', 'order'],
        });
        if (!item) return null;
        item.itemStatus = itemStatus;
        return item.save();
    }

    static async cancelOrder(id: string): Promise<Order | null> {
        const order = await this.getOrderById(id);
        if (!order) return null;
        order.orderStatus = OrderStatus.CANCELLED;
        order.isActive = false;
        await order.save();
        return this.getOrderById(id);
    }

    static async assignOrderHandler(id: string, handledBy: string): Promise<Order | null> {
        const order = await this.getOrderById(id);
        if (!order) return null;
        order.handledBy = handledBy;
        await order.save();
        return this.getOrderById(id);
    }
}
