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
                body('handledBy').isString().withMessage('handledBy must be a valid user id'),
            ]);

            const { orderStatus, paymentStatus, handledBy } = req.body as {
                orderStatus?: OrderStatus;
                paymentStatus?: PaymentStatus;
                handledBy?: string;
            };

            if (!orderStatus && !paymentStatus) {
                return this.badRequest(res, 'At least one of orderStatus or paymentStatus is required');
            }

            if (orderStatus) {
                const updatedOrder = await OrderService.updateOrderStatus(req.params.id, orderStatus);
                if (!updatedOrder) {
                    return this.notFound(res, 'Order not found');
                }
            }

            if (paymentStatus) {
                const updatedOrder = await OrderService.updatePaymentStatus(req.params.id, paymentStatus);
                if (!updatedOrder) {
                    return this.notFound(res, 'Order not found');
                }
            }

            if (handledBy) {
                const assigned = await OrderService.assignOrderHandler(req.params.id, handledBy);
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
