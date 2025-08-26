import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Africa Landing Page API',
      version: '1.0.0',
      description: 'API documentation for E-Africa Landing Page backend with OAuth authentication, email verification, and password reset functionality',
      contact: {
        name: 'E-Africa Support',
        email: 'eafrica.ng@gmail.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      // {
      //   url: 'https://e-africa-landing-page-backend.onrender.com',
      //   description: 'Production server'
      // }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/docs/*.swagger.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
