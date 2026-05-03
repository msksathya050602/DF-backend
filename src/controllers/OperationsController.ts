import { CustomRequest } from '@customTypes/customRequest';
import { OrderStatus, PaymentStatus } from '@entities/Order';
import { OrderService } from '@services/OrderService';
import { NextFunction, Response } from 'express';
import { body, param, query } from 'express-validator';

import { validateRequest } from '../helpers/validateRequest';
import { BaseController } from './baseController';

export class OperationsController extends BaseController {
    private static instance: OperationsController;

    private constructor() {
        super();
    }

    public static initialize(): OperationsController {
        if (!OperationsController.instance) {
            OperationsController.instance = new OperationsController();
        }
        return OperationsController.instance;
    }

    public async getTodayDeliveryOrders(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [
                query('date')
                    .optional({ values: 'falsy' })
                    .matches(/^\d{4}-\d{2}-\d{2}$/)
                    .withMessage('date must be YYYY-MM-DD'),
            ]);
            const branchId = typeof req.query?.branchId === 'string' && req.query.branchId.trim() ? req.query.branchId.trim() : undefined;
            const dateRaw = typeof req.query?.date === 'string' ? req.query.date.trim() : '';
            let day = new Date();
            if (dateRaw) {
                const [y, m, d] = dateRaw.split('-').map(Number);
                day = new Date(y, m - 1, d);
            }
            const orders = await OrderService.getDeliveryOrdersForCalendarDay(day, branchId);
            return this.ok(res, {
                orders,
                count: orders.length,
                availableOrderStatuses: Object.values(OrderStatus),
                availablePaymentStatuses: Object.values(PaymentStatus),
            });
        } catch (error) {
            next(error);
        }
    }

    public async updateDeliveryOrderStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [
                param('id').isUUID().withMessage('Valid order ID is required'),
                body('orderStatus').optional().isIn(Object.values(OrderStatus)).withMessage('Valid orderStatus is required'),
                body('paymentStatus').optional().isIn(Object.values(PaymentStatus)).withMessage('Valid paymentStatus is required'),
                body('amountPaid').optional().isFloat({ gt: 0 }).withMessage('amountPaid must be a positive number'),
                body('handledBy').optional().isString().withMessage('handledBy must be a string'),
            ]);

            const { orderStatus, paymentStatus, handledBy } = req.body as {
                orderStatus?: OrderStatus;
                paymentStatus?: PaymentStatus;
                handledBy?: string;
                amountPaid?: unknown;
            };

            let amountPaid: number | undefined;
            if (req.body?.amountPaid !== undefined && req.body?.amountPaid !== null && req.body?.amountPaid !== '') {
                const n = Number(req.body.amountPaid);
                if (Number.isNaN(n)) {
                    return this.badRequest(res, 'amountPaid must be a number');
                }
                amountPaid = n;
            }

            if (!orderStatus && !paymentStatus) {
                return this.badRequest(res, 'At least one of orderStatus or paymentStatus is required');
            }

            if (paymentStatus === PaymentStatus.PARTIAL && amountPaid === undefined) {
                return this.badRequest(res, 'amountPaid is required when payment status is PARTIAL');
            }

            if (orderStatus) {
                const updatedOrder = await OrderService.updateOrderStatus(req.params.id, orderStatus);
                if (!updatedOrder) {
                    return this.notFound(res, 'Order not found');
                }
            }

            if (paymentStatus) {
                try {
                    const updatedOrder = await OrderService.updatePaymentStatus(req.params.id, paymentStatus, amountPaid);
                    if (!updatedOrder) {
                        return this.notFound(res, 'Order not found');
                    }
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Invalid payment update';
                    return this.badRequest(res, msg);
                }
            }

            const trimmedHandled = typeof handledBy === 'string' ? handledBy.trim() : '';
            if (trimmedHandled) {
                const assigned = await OrderService.assignOrderHandler(req.params.id, trimmedHandled);
                if (!assigned) {
                    return this.notFound(res, 'Order not found');
                }
            }

            const order = await OrderService.getOrderById(req.params.id);
            if (!order) {
                return this.notFound(res, 'Order not found');
            }

            return this.ok(res, { order, message: 'Delivery order status updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
