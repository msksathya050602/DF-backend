import { CustomOpenAPIPath } from "@customTypes/customOpenapi";
import { STATUSCODES } from "@customTypes/statusCodes";

export const orderPaths: CustomOpenAPIPath = {
  "/orders": {
    get: {
      tags: ["Orders"],
      summary: "Get all orders",
      operationId: "getAllOrders",
      responses: {
        [STATUSCODES.OK]: { description: "Orders fetched successfully" },
      },
    },
    post: {
      tags: ["Orders"],
      summary: "Create order",
      operationId: "createOrder",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["customerId", "branchId", "items"],
              properties: {
                customerId: { type: "string", example: "customer-uuid" },
                branchId: { type: "string", example: "branch-uuid" },
                discountAmount: { type: "number", example: 0 },
                taxAmount: { type: "number", example: 0 },
                notes: { type: "string", example: "Handle with care" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["productId", "serviceId", "quantity"],
                    properties: {
                      productId: { type: "string", example: "product-uuid" },
                      serviceId: { type: "string", example: "service-uuid" },
                      quantity: { type: "number", example: 2 },
                      remarks: { type: "string", example: "Remove stains" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        [STATUSCODES.CREATED]: { description: "Order created successfully" },
        [STATUSCODES.BAD_REQUEST]: { description: "Invalid order payload" },
      },
    },
  },
  "/orders/{id}": {
    get: {
      tags: ["Orders"],
      summary: "Get order by ID",
      operationId: "getOrderById",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        [STATUSCODES.OK]: { description: "Order fetched successfully" },
        [STATUSCODES.NOT_FOUND]: { description: "Order not found" },
      },
    },
    delete: {
      tags: ["Orders"],
      summary: "Cancel order",
      operationId: "cancelOrder",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        [STATUSCODES.OK]: { description: "Order cancelled successfully" },
      },
    },
  },
  "/orders/{id}/status": {
    patch: {
      tags: ["Orders"],
      summary: "Update order status",
      operationId: "updateOrderStatus",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderStatus"],
              properties: {
                orderStatus: {
                  type: "string",
                  enum: ["CREATED", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"],
                },
              },
            },
          },
        },
      },
      responses: {
        [STATUSCODES.OK]: { description: "Order status updated successfully" },
      },
    },
  },
  "/orders/{id}/payment-status": {
    patch: {
      tags: ["Orders"],
      summary: "Update payment status",
      operationId: "updatePaymentStatus",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["paymentStatus"],
              properties: {
                paymentStatus: {
                  type: "string",
                  enum: ["PENDING", "PAID", "PARTIAL", "REFUNDED"],
                },
              },
            },
          },
        },
      },
      responses: {
        [STATUSCODES.OK]: { description: "Payment status updated successfully" },
      },
    },
  },
  "/order-items/{id}/status": {
    patch: {
      tags: ["Orders"],
      summary: "Update order item status",
      operationId: "updateOrderItemStatus",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["itemStatus"],
              properties: {
                itemStatus: {
                  type: "string",
                  enum: ["RECEIVED", "PROCESSING", "DONE", "DELIVERED"],
                },
              },
            },
          },
        },
      },
      responses: {
        [STATUSCODES.OK]: { description: "Order item status updated successfully" },
      },
    },
  },
};
