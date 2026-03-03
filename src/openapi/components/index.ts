import { STATUSCODES } from "@customTypes/statusCodes";
import swaggerJSDoc from "swagger-jsdoc";

export const components: swaggerJSDoc.Components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  schemas: {
    ErrorResponse: {
      type: "object",
      required: ["error_code", "error_message"],
      properties: {
        error_code: {
          type: "string",
          default: STATUSCODES.INTERNAL_SERVER_ERROR,
        },
        error_message: {
          type: "string",
          default: "Internal Server Error",
        },
      },
    },

    Branch: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "Unique identifier of the branch",
          example: "e3b0c442-98fc-1c14-9afb-f4c8996fb924",
        },
        branchName: {
          type: "string",
          maxLength: 255,
          description: "Name of the branch",
          example: "Main Branch",
        },
        branchAddress: {
          type: "string",
          nullable: true,
          description: "Address of the branch",
          example: "123 Main Street, Chennai",
        },
        branchPhone: {
          type: "string",
          maxLength: 20,
          nullable: true,
          description: "Contact phone number of the branch",
          example: "9876543210",
        },
        isActive: {
          type: "boolean",
          description: "Whether the branch is currently active",
          example: true,
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "Timestamp when the branch was created",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          description: "Timestamp when the branch was last updated",
        },
      },
    },

    CreateBranchRequest: {
      type: "object",
      required: ["branchName"],
      properties: {
        branchName: {
          type: "string",
          maxLength: 255,
          description: "Name of the branch",
          example: "Main Branch",
        },
        branchAddress: {
          type: "string",
          description: "Address of the branch",
          example: "123 Main Street, Chennai",
        },
        branchPhone: {
          type: "string",
          maxLength: 20,
          description: "Contact phone number of the branch",
          example: "9876543210",
        },
      },
    },

    UpdateBranchRequest: {
      type: "object",
      properties: {
        branchName: {
          type: "string",
          maxLength: 255,
          description: "Updated name of the branch",
          example: "Updated Branch",
        },
        branchAddress: {
          type: "string",
          description: "Updated address of the branch",
          example: "456 New Street, Bangalore",
        },
        branchPhone: {
          type: "string",
          maxLength: 20,
          description: "Updated phone number of the branch",
          example: "9123456780",
        },
        isActive: {
          type: "boolean",
          description: "Set branch active/inactive status",
          example: true,
        },
      },
    },
  },
};

