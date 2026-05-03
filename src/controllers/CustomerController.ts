import { CustomRequest } from '@customTypes/customRequest';
import { CustomerService } from '@services/CustomerService';
import { OrderService } from '@services/OrderService';
import { NextFunction, Response } from 'express';
import { body, param } from 'express-validator';

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

    /** GET /customers/search?phone=… | ?name=… — exactly one of phone or name (cached-friendly for autocomplete). */
    public async searchCustomers(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            const rawPhone = req.query.phone != null ? String(req.query.phone).trim() : '';
            const rawName = req.query.name != null ? String(req.query.name).trim() : '';
            const hasPhone = rawPhone.length > 0;
            const hasName = rawName.length > 0;

            if (hasPhone && hasName) {
                return this.badRequest(res, 'Provide either phone or name, not both');
            }
            if (!hasPhone && !hasName) {
                return this.badRequest(res, 'Provide phone (2+ digits) or name (2+ characters)');
            }

            let limit = 10;
            if (req.query.limit != null && req.query.limit !== '') {
                const n = Number(req.query.limit);
                if (!Number.isFinite(n) || n < 1 || n > 50) {
                    return this.badRequest(res, 'limit must be between 1 and 50');
                }
                limit = Math.floor(n);
            }

            if (hasPhone) {
                const digits = rawPhone.replace(/\D/g, '');
                if (digits.length < 2) {
                    return this.badRequest(res, 'Phone query must match at least 2 digits');
                }
                const customers = await CustomerService.searchCustomersByPhone(rawPhone, Math.min(limit, 20));
                return this.ok(res, { customers, count: customers.length });
            }

            if (rawName.length < 2) {
                return this.badRequest(res, 'Name query must be at least 2 characters');
            }
            const customers = await CustomerService.searchCustomersByName(rawName, Math.min(limit, 50));
            return this.ok(res, { customers, count: customers.length });
        } catch (error) {
            next(error);
        }
    }
}
