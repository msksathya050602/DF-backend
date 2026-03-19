import { CustomRequest } from "@customTypes/customRequest";
import { CustomerService } from "@services/CustomerService";
import { OrderService } from "@services/OrderService";
import { NextFunction, Response } from "express";
import { body, param } from "express-validator";

import { validateRequest } from "../helpers/validateRequest";
import { BaseController } from "./baseController";

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

  public getAllCustomers = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
      const customers = await CustomerService.getAllCustomers();
      return this.ok(res, { customers });
    } catch (error) {
      return this.internalServerError(res, (error as Error)?.message || "Failed to fetch customers");
    }
  };

  public getCustomerById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      await validateRequest(req, [param("id").isUUID().withMessage("Valid customer ID is required")]);
      const { id } = req.params;
      const customer = await CustomerService.getCustomerById(id);
      if (!customer) {
        return this.notFound(res, "Customer not found");
      }
      return this.ok(res, { customer });
    } catch (error) {
      next(error);
    }
  };

  public getCustomerOrders = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      await validateRequest(req, [param("id").isUUID().withMessage("Valid customer ID is required")]);
      const { id } = req.params;
      const customer = await CustomerService.getCustomerById(id);
      if (!customer) {
        return this.notFound(res, "Customer not found");
      }
      const orders = await OrderService.getOrdersByCustomerId(id);
      return this.ok(res, { customerId: id, orders, count: orders.length });
    } catch (error) {
      next(error);
    }
  };

  public createCustomer = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      await validateRequest(req, [
        body("firstName").isString().trim().notEmpty().withMessage("First name is required"),
        body("lastName").optional().isString().trim(),
        body("customerPhone").optional().isString().trim(),
        body("customerEmail").optional().isString().trim().isEmail().withMessage("Valid email required if provided"),
        body("customerAddress").optional().isString().trim(),
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
  };
}
