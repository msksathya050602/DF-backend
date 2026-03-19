import { CustomRequest } from "@customTypes/customRequest";
import { OrderStatus, PaymentStatus } from "@entities/Order";
import { OrderItemStatus } from "@entities/OrderItem";
import { OrderService } from "@services/OrderService";
import { NextFunction, Response } from "express";

import { BaseController } from "./baseController";

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

  public getAllOrders = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await OrderService.getAllOrders();
      this.ok(res, { orders });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      if (!order) {
        this.notFound(res, "Order not found");
        return;
      }
      this.ok(res, { order });
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: CustomRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { customerId, branchId, items } = req.body;
      if (!customerId || !branchId || !Array.isArray(items) || items.length === 0) {
        this.badRequest(res, "customerId, branchId and at least one item are required");
        return;
      }
      const order = await OrderService.createOrder(req.body);
      this.created(res, { order });
    } catch (error: any) {
      this.badRequest(res, error?.message || "Failed to create order");
    }
  };

  public updateOrderStatus = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { orderStatus } = req.body as { orderStatus?: OrderStatus };
      if (!orderStatus || !Object.values(OrderStatus).includes(orderStatus)) {
        this.badRequest(res, "Valid orderStatus is required");
        return;
      }
      const order = await OrderService.updateOrderStatus(req.params.id, orderStatus);
      if (!order) {
        this.notFound(res, "Order not found");
        return;
      }
      this.ok(res, { order });
    } catch (error) {
      next(error);
    }
  };

  public updatePaymentStatus = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { paymentStatus } = req.body as { paymentStatus?: PaymentStatus };
      if (!paymentStatus || !Object.values(PaymentStatus).includes(paymentStatus)) {
        this.badRequest(res, "Valid paymentStatus is required");
        return;
      }
      const order = await OrderService.updatePaymentStatus(req.params.id, paymentStatus);
      if (!order) {
        this.notFound(res, "Order not found");
        return;
      }
      this.ok(res, { order });
    } catch (error) {
      next(error);
    }
  };

  public updateOrderItemStatus = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { itemStatus } = req.body as { itemStatus?: OrderItemStatus };
      if (!itemStatus || !Object.values(OrderItemStatus).includes(itemStatus)) {
        this.badRequest(res, "Valid itemStatus is required");
        return;
      }
      const item = await OrderService.updateOrderItemStatus(req.params.id, itemStatus);
      if (!item) {
        this.notFound(res, "Order item not found");
        return;
      }
      this.ok(res, { item });
    } catch (error) {
      next(error);
    }
  };

  public cancelOrder = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await OrderService.cancelOrder(req.params.id);
      if (!order) {
        this.notFound(res, "Order not found");
        return;
      }
      this.ok(res, { order, message: "Order cancelled successfully" });
    } catch (error) {
      next(error);
    }
  };
}
