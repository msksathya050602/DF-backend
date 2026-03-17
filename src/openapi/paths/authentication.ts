import { CustomOpenAPIPath } from "@customTypes/customOpenapi";
import { STATUSCODES } from "@customTypes/statusCodes";

export const authenticationPaths: CustomOpenAPIPath = {
  "/users": {
    post: {
      tags: ["Authentication"],
      summary: "Register User",
      description: "Create a user and store in database",
      operationId: "registerUser",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["userName", "email", "password"],
              properties: {
                userName: { type: "string", example: "sathya" },
                email: { type: "string", format: "email", example: "user@example.com" },
                password: { type: "string", example: "StrongPass@123" },
              },
            },
          },
        },
      },
      responses: {
        [STATUSCODES.CREATED]: {
          description: "User created successfully",
        },
        [STATUSCODES.CONFLICT]: {
          description: "User already exists",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/login": {
    post: {
      tags: ["Authentication"],
      summary: "Login",
      description: "Login using email and password",
      operationId: "login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email", example: "admin@dailyfresh.com" },
                password: { type: "string", example: "Admin@123456" },
              },
            },
          },
        },
      },
      responses: {
        [STATUSCODES.OK]: {
          description: "Login successful",
        },
        [STATUSCODES.UNAUTHORIZED]: {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/refresh": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh Access Token",
      description: "Generate new access token using refresh token",
      operationId: "refreshToken",
      responses: {
        [STATUSCODES.OK]: {
          description: "Access token refreshed",
        },
        [STATUSCODES.UNAUTHORIZED]: {
          description: "Invalid refresh token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/users/me": {
    get: {
      tags: ["Authentication"],
      summary: "Get Current User",
      description: "Returns logged in user details",
      operationId: "getMe",
      security: [{ bearerAuth: [] }],
      responses: {
        [STATUSCODES.OK]: {
          description: "Current user details",
        },
        [STATUSCODES.UNAUTHORIZED]: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/logout": {
    post: {
      tags: ["Authentication"],
      summary: "Logout",
      description: "Clear refresh token cookie",
      operationId: "logout",
      responses: {
        [STATUSCODES.NO_CONTENT]: {
          description: "Logout successful",
        },
      },
    },
  },
};
