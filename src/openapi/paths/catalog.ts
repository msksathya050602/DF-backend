import { CustomOpenAPIPath } from "@customTypes/customOpenapi";
import { STATUSCODES } from "@customTypes/statusCodes";

export const catalogPaths: CustomOpenAPIPath = {
  "/categories": {
    get: {
      tags: ["Catalog"],
      summary: "Get all categories",
      operationId: "getAllCategories",
      responses: {
        [STATUSCODES.OK]: { description: "Categories fetched successfully" },
      },
    },
    post: {
      tags: ["Catalog"],
      summary: "Create category",
      operationId: "createCategory",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["categoryName"],
              properties: {
                categoryName: { type: "string", example: "Regular" },
              },
            },
          },
        },
      },
      responses: {
        [STATUSCODES.CREATED]: { description: "Category created successfully" },
      },
    },
  },
  "/categories/{id}": {
    get: {
      tags: ["Catalog"],
      summary: "Get category by ID",
      operationId: "getCategoryById",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        [STATUSCODES.OK]: { description: "Category fetched successfully" },
        [STATUSCODES.NOT_FOUND]: { description: "Category not found" },
      },
    },
    put: {
      tags: ["Catalog"],
      summary: "Update category",
      operationId: "updateCategory",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        [STATUSCODES.OK]: { description: "Category updated successfully" },
      },
    },
    delete: {
      tags: ["Catalog"],
      summary: "Delete category",
      operationId: "deleteCategory",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        [STATUSCODES.OK]: { description: "Category deleted successfully" },
      },
    },
  },
  "/products": {
    get: {
      tags: ["Catalog"],
      summary: "Get all products",
      operationId: "getAllProducts",
      responses: { [STATUSCODES.OK]: { description: "Products fetched successfully" } },
    },
    post: {
      tags: ["Catalog"],
      summary: "Create product",
      operationId: "createProduct",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["categoryId", "productName"],
              properties: {
                categoryId: { type: "string", example: "uuid" },
                productName: { type: "string", example: "SHIRT" },
              },
            },
          },
        },
      },
      responses: { [STATUSCODES.CREATED]: { description: "Product created successfully" } },
    },
  },
  "/products/{id}": {
    get: {
      tags: ["Catalog"],
      summary: "Get product by ID",
      operationId: "getProductById",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Product fetched successfully" } },
    },
    put: {
      tags: ["Catalog"],
      summary: "Update product",
      operationId: "updateProduct",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Product updated successfully" } },
    },
    delete: {
      tags: ["Catalog"],
      summary: "Delete product",
      operationId: "deleteProduct",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Product deleted successfully" } },
    },
  },
  "/services": {
    get: {
      tags: ["Catalog"],
      summary: "Get all services",
      operationId: "getAllServices",
      responses: { [STATUSCODES.OK]: { description: "Services fetched successfully" } },
    },
    post: {
      tags: ["Catalog"],
      summary: "Create service",
      operationId: "createService",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["serviceName", "serviceCode"],
              properties: {
                serviceName: { type: "string", example: "WASHING" },
                serviceCode: { type: "string", example: "WASHING" },
              },
            },
          },
        },
      },
      responses: { [STATUSCODES.CREATED]: { description: "Service created successfully" } },
    },
  },
  "/services/{id}": {
    get: {
      tags: ["Catalog"],
      summary: "Get service by ID",
      operationId: "getServiceById",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Service fetched successfully" } },
    },
    put: {
      tags: ["Catalog"],
      summary: "Update service",
      operationId: "updateService",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Service updated successfully" } },
    },
    delete: {
      tags: ["Catalog"],
      summary: "Delete service",
      operationId: "deleteService",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Service deleted successfully" } },
    },
  },
  "/pricing": {
    get: {
      tags: ["Catalog"],
      summary: "Get all pricing rows",
      operationId: "getAllPricing",
      responses: { [STATUSCODES.OK]: { description: "Pricing rows fetched successfully" } },
    },
    post: {
      tags: ["Catalog"],
      summary: "Create pricing row",
      operationId: "createPricing",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["productId", "serviceId", "price"],
              properties: {
                productId: { type: "string", example: "uuid" },
                serviceId: { type: "string", example: "uuid" },
                price: { type: "number", example: 60 },
                currency: { type: "string", example: "INR" },
              },
            },
          },
        },
      },
      responses: { [STATUSCODES.CREATED]: { description: "Pricing row created successfully" } },
    },
  },
  "/pricing/{id}": {
    get: {
      tags: ["Catalog"],
      summary: "Get pricing by ID",
      operationId: "getPricingById",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Pricing fetched successfully" } },
    },
    put: {
      tags: ["Catalog"],
      summary: "Update pricing row",
      operationId: "updatePricing",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Pricing updated successfully" } },
    },
    delete: {
      tags: ["Catalog"],
      summary: "Delete pricing row",
      operationId: "deletePricing",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { [STATUSCODES.OK]: { description: "Pricing deleted successfully" } },
    },
  },
};
