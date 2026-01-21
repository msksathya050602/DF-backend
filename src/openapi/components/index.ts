import { STATUSCODES } from '@customTypes/statusCodes';
import swaggerJSDoc from 'swagger-jsdoc';

export const components: swaggerJSDoc.Components = {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
    schemas: {
        ErrorResponse: {
            type: 'object',
            required: ['error_code', 'error_message'],
            properties: {
                error_code: {
                    type: 'string',
                    default: STATUSCODES.INTERNAL_SERVER_ERROR,
                },
                error_message: {
                    type: 'string',
                    default: 'Internal Server Error',
                },
            },
        },
    },
};
