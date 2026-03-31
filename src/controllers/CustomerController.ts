import { CustomRequest } from '@customTypes/customRequest';
import { CustomerService } from '@services/CustomerService';
import { OrderService } from '@services/OrderService';
import { NextFunction, Response } from 'express';
import { body, param, query } from 'express-validator';

import { validateRequest } from '../helpers/validateRequest';
import { BaseController } from './baseController';

export class CustomerController extends BaseController {
    private static instance: CustomerController;

    private constructor() {
        super();
    }

    public static initialize(): CustomerController {
        if (!CustomerController.instance) {
            CustomerController.instance = new CustomerController();
        }
        return CustomerController.instance;
    }

    public async getAllCustomers(req: CustomRequest, res: Response): Promise<any> {
        try {
            const customers = await CustomerService.getAllCustomers();
            return this.ok(res, { customers });
        } catch (error) {
            return this.internalServerError(res, (error as Error)?.message || 'Failed to fetch customers');
        }
    }

    public async getCustomerById(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid customer ID is required')]);
            const { id } = req.params;
            const customer = await CustomerService.getCustomerById(id);
            if (!customer) {
                return this.notFound(res, 'Customer not found');
            }
            return this.ok(res, { customer });
        } catch (error) {
            next(error);
        }
    }

    public async getCustomerOrders(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid customer ID is required')]);
            const { id } = req.params;
            const customer = await CustomerService.getCustomerById(id);
            if (!customer) {
                return this.notFound(res, 'Customer not found');
            }
            const orders = await OrderService.getOrdersByCustomerId(id);
            return this.ok(res, { customerId: id, orders, count: orders.length });
        } catch (error) {
            next(error);
        }
    }

    public async createCustomer(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [
                body('firstName').isString().trim().notEmpty().withMessage('First name is required'),
                body('lastName').optional().isString().trim(),
                body('customerPhone').optional().isString().trim(),
                body('customerEmail').optional().isString().trim().isEmail().withMessage('Valid email required if provided'),
                body('customerAddress').optional().isString().trim(),
            ]);
            const { firstName, lastName, customerPhone, customerEmail, customerAddress } = req.body;
            const customer = await CustomerService.createCustomer({
                firstName,
                lastName,
                customerPhone,
                customerEmail,
                customerAddress,
            });
            return this.created(res, { customer });
        } catch (error) {
            next(error);
        }
    }

    public async searchCustomersByPhone(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [
                query('phone').isString().trim().isLength({ min: 2 }).withMessage('Phone must be at least 2 digits'),
                query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20'),
            ]);
            const phone = String(req.query.phone).trim();
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const customers = await CustomerService.searchCustomersByPhone(phone, limit);
            return this.ok(res, { customers, count: customers.length });
        } catch (error) {
            next(error);
        }
    }
}
