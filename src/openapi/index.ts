import swaggerJsdoc from "swagger-jsdoc";

import { components } from "./components";
import { paths } from "./paths";
import { tags } from "./tags";

const options: swaggerJsdoc.OAS3Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "DF API Documentation",
      version: "1.0.0",
      description: "Official API documentation for the DF Backend",
    },
    servers: [
      {
        url: "http://localhost:5000/v1",
        description: "Local Development",
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
