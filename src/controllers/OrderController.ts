import { CustomRequest } from '@customTypes/customRequest';
import { OrderStatus, PaymentStatus } from '@entities/Order';
import { OrderItemStatus } from '@entities/OrderItem';
import { OrderService } from '@services/OrderService';
import { NextFunction, Response } from 'express';
import { body, param, query } from 'express-validator';

import { validateRequest } from '../helpers/validateRequest';
import { BaseController } from './baseController';

export class OrderController extends BaseController {
    private static instance: OrderController;

    private constructor() {
        super();
    }

    public static initialize(): OrderController {
        if (!OrderController.instance) {
            OrderController.instance = new OrderController();
        }
        return OrderController.instance;
    }

    public async getAllOrders(_req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            const orders = await OrderService.getAllOrders();
            return this.ok(res, { orders });
        } catch (error) {
            next(error);
        }
    }

    public async getOrderById(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid order ID is required')]);
            const order = await OrderService.getOrderById(req.params.id);
            if (!order) {
                return this.notFound(res, 'Order not found');
            }
            return this.ok(res, { order });
        } catch (error) {
            next(error);
        }
    }

    public async searchOrdersByPhone(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [query('phone').isString().trim().isLength({ min: 2 }).withMessage('phone query must be at least 2 characters')]);
            const phone = String(req.query.phone).trim();
            const { customers, orders } = await OrderService.getOrdersByCustomerPhone(phone);
            return this.ok(res, { customers, orders });
        } catch (error) {
            next(error);
        }
    }

    public async createOrder(req: CustomRequest, res: Response, _next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [
                body('customerId').isUUID().withMessage('Valid customerId is required'),
                body('branchId').isUUID().withMessage('Valid branchId is required'),
                body('items').isArray({ min: 1 }).withMessage('At least one order item is required'),
                body('items.*.productId').isUUID().withMessage('Valid productId is required'),
                body('items.*.serviceId').isUUID().withMessage('Valid serviceId is required'),
                body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
                body('discountAmount').optional().isFloat({ min: 0 }),
                body('taxAmount').optional().isFloat({ min: 0 }),
                body('pickupDate').optional({ values: 'falsy' }).isISO8601().withMessage('pickupDate must be a valid ISO 8601 date'),
                body('deliveryDate').optional({ values: 'falsy' }).isISO8601().withMessage('deliveryDate must be a valid ISO 8601 date'),
                body('expectedDeliveryDate').optional({ values: 'falsy' }).isISO8601().withMessage('expectedDeliveryDate must be a valid ISO 8601 date'),
                body('notes').optional().isString().trim(),
            ]);
            const order = await OrderService.createOrder(req.body);
            await new Promise<void>(resolve => setTimeout(resolve, 2000));
            return this.created(res, { order });
        } catch (error: any) {
            return this.badRequest(res, error?.message || 'Failed to create order');
        }
    }

    public async updateOrderStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid order ID is required')]);
            const { orderStatus } = req.body as { orderStatus?: OrderStatus };
            if (!orderStatus || !Object.values(OrderStatus).includes(orderStatus)) {
                return this.badRequest(res, 'Valid orderStatus is required');
            }
            const order = await OrderService.updateOrderStatus(req.params.id, orderStatus);
            if (!order) {
                return this.notFound(res, 'Order not found');
            }
            return this.ok(res, { order });
        } catch (error) {
            next(error);
        }
    }

    public async updatePaymentStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid order ID is required')]);
            const { paymentStatus } = req.body as { paymentStatus?: PaymentStatus };
            if (!paymentStatus || !Object.values(PaymentStatus).includes(paymentStatus)) {
                return this.badRequest(res, 'Valid paymentStatus is required');
            }
            const order = await OrderService.updatePaymentStatus(req.params.id, paymentStatus);
            if (!order) {
                return this.notFound(res, 'Order not found');
            }
            return this.ok(res, { order });
        } catch (error) {
            next(error);
        }
    }

    public async updateOrderItemStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid order item ID is required')]);
            const { itemStatus } = req.body as { itemStatus?: OrderItemStatus };
            if (!itemStatus || !Object.values(OrderItemStatus).includes(itemStatus)) {
                return this.badRequest(res, 'Valid itemStatus is required');
            }
            const item = await OrderService.updateOrderItemStatus(req.params.id, itemStatus);
            if (!item) {
                return this.notFound(res, 'Order item not found');
            }
            return this.ok(res, { item });
        } catch (error) {
            next(error);
        }
    }

    public async cancelOrder(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid order ID is required')]);
            const order = await OrderService.cancelOrder(req.params.id);
            if (!order) {
                return this.notFound(res, 'Order not found');
            }
            return this.ok(res, { order, message: 'Order cancelled successfully' });
        } catch (error) {
            next(error);
        }
    }
}
