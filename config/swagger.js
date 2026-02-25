// config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DTC 2026 API",
      version: "1.0.0",
      description: "Official API for Design Thinking Challenge 2026",
    },
    servers: [
      { url: "http://localhost:5000", description: "Local" },
      { url: "https://dtc-backend-1.onrender.com", description: "Production" },
      { url: "https://crispy-fishstick-v7wrwrx54g63xr9q-5000.app.github.dev", description: "SandBox" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token from /api/auth/login (username: admin, password: Dtc2026Admin@123)",
        },
      },
      schemas: {
        // Keep all your existing schemas here
        IndividualApplication: { /* your schema */ },
        TeamApplication: { /* your schema */ },
        StatusUpdate: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["pending", "reviewing", "shortlisted", "accepted", "rejected"],
            },
            notes: { type: "string" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            pages: { type: "integer" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);