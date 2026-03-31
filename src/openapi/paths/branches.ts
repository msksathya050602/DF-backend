import { CustomOpenAPIPath } from '@customTypes/customOpenapi';
import { STATUSCODES } from '@customTypes/statusCodes';

export const branchPaths: CustomOpenAPIPath = {
    '/branches': {
        get: {
            tags: ['Branches'],
            summary: 'Get all branches',
            description: 'Returns a list of all branches. Allowed roles: user, admin.',
            operationId: 'getAllBranches',
            security: [{ bearerAuth: [] }],
            responses: {
                [STATUSCODES.OK]: {
                    description: 'List of branches retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    branches: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Branch' },
                                    },
                                },
                            },
                        },
                    },
                },
                [STATUSCODES.INTERNAL_SERVER_ERROR]: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.UNAUTHORIZED]: {
                    description: 'Authorization required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.FORBIDDEN]: {
                    description: 'Required role is missing for authorization',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },

        post: {
            tags: ['Branches'],
            summary: 'Create a new branch',
            description: 'Creates a new branch record. Allowed roles: admin.',
            operationId: 'createBranch',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateBranchRequest' },
                        example: {
                            branchName: 'Main Branch',
                            branchAddress: '123 Main Street, Chennai',
                            branchPhone: '9876543210',
                        },
                    },
                },
            },
            responses: {
                [STATUSCODES.CREATED]: {
                    description: 'Branch created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    branch: { $ref: '#/components/schemas/Branch' },
                                },
                            },
                        },
                    },
                },
                [STATUSCODES.BAD_REQUEST]: {
                    description: 'Branch name is required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.INTERNAL_SERVER_ERROR]: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.UNAUTHORIZED]: {
                    description: 'Authorization required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.FORBIDDEN]: {
                    description: 'Required role is missing for authorization',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },
    },

    '/branches/{id}': {
        get: {
            tags: ['Branches'],
            summary: 'Get a branch by ID',
            description: 'Returns a single branch by its UUID. Allowed roles: user, admin.',
            operationId: 'getBranchById',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'UUID of the branch',
                    schema: { type: 'string', format: 'uuid' },
                },
            ],
            responses: {
                [STATUSCODES.OK]: {
                    description: 'Branch retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    branch: { $ref: '#/components/schemas/Branch' },
                                },
                            },
                        },
                    },
                },
                [STATUSCODES.NOT_FOUND]: {
                    description: 'Branch not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.INTERNAL_SERVER_ERROR]: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.UNAUTHORIZED]: {
                    description: 'Authorization required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.FORBIDDEN]: {
                    description: 'Required role is missing for authorization',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },

        put: {
            tags: ['Branches'],
            summary: 'Update a branch',
            description: 'Updates an existing branch by its UUID. Allowed roles: admin.',
            operationId: 'updateBranch',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'UUID of the branch',
                    schema: { type: 'string', format: 'uuid' },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateBranchRequest' },
                        example: {
                            branchName: 'Updated Branch Name',
                            branchAddress: '456 New Street, Bangalore',
                            branchPhone: '9123456780',
                            isActive: true,
                        },
                    },
                },
            },
            responses: {
                [STATUSCODES.OK]: {
                    description: 'Branch updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    branch: { $ref: '#/components/schemas/Branch' },
                                },
                            },
                        },
                    },
                },
                [STATUSCODES.NOT_FOUND]: {
                    description: 'Branch not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.INTERNAL_SERVER_ERROR]: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.UNAUTHORIZED]: {
                    description: 'Authorization required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.FORBIDDEN]: {
                    description: 'Required role is missing for authorization',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },

        delete: {
            tags: ['Branches'],
            summary: 'Delete a branch',
            description: 'Soft-deletes a branch by its UUID (sets isActive to false). Allowed roles: admin.',
            operationId: 'deleteBranch',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'UUID of the branch',
                    schema: { type: 'string', format: 'uuid' },
                },
            ],
            responses: {
                [STATUSCODES.OK]: {
                    description: 'Branch deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Branch deleted successfully',
                                    },
                                },
                            },
                        },
                    },
                },
                [STATUSCODES.NOT_FOUND]: {
                    description: 'Branch not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.INTERNAL_SERVER_ERROR]: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.UNAUTHORIZED]: {
                    description: 'Authorization required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                [STATUSCODES.FORBIDDEN]: {
                    description: 'Required role is missing for authorization',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },
    },
};
