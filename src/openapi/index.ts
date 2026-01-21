import swaggerJsdoc from 'swagger-jsdoc';

import { components } from './components';
import { paths } from './paths';
import { tags } from './tags';

const options: swaggerJsdoc.OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'Official API documentation',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Localhost',
            },
            // Add more servers as needed
        ],
        paths,
        tags,
        components,
    },
    apis: [],
};

const specs = swaggerJsdoc(options);

export default specs;
