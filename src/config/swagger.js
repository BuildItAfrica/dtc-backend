const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Design Thinking Challenge (DTC) 2026 API",
      version: "1.0.0",
      description: `
## Overview
API for managing applications to the Design Thinking Challenge 2026 - Africa's premier innovation challenge focused on Healthcare, Energy, and Agriculture.

## Focus Areas
- **Healthcare** - Telemedicine, AI diagnostics, maternal health solutions
- **Energy** - Solar microgrids, IoT energy management, pay-as-you-go systems
- **Agriculture** - Precision farming, smart storage, blockchain traceability

## Participant Types
- **Hard-Tech Specialist** - Engineers, scientists, hardware experts (CTO track)
- **Software/Data/AI Specialist** - Developers, data scientists, ML engineers
- **Commercial/Operator Leader** - Entrepreneurs, sector operators (CEO/COO track)
- **Catalyst (Wildcard)** - Designers, farmers, product managers, domain experts

## Powered By
- Ministry of Innovation, Science, and Technology Enugu-State
- TD Africa
- EnuguTech Fest
      `,
      contact: {
        name: "DTC Support",
        email: "support@dtc2026.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.dtc2026.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Applications",
        description: "Application submission and management endpoints",
      },
      {
        name: "Statistics",
        description: "Dashboard and analytics endpoints",
      },
      {
        name: "Health",
        description: "Server health check",
      },
    ],
    components: {
      schemas: {
        IndividualApplication: {
          type: "object",
          required: ["fullName", "email", "participantType", "focusAreas", "motivation"],
          properties: {
            fullName: {
              type: "string",
              example: "John Doe",
              description: "Full name of the applicant",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
              description: "Email address",
            },
            phone: {
              type: "string",
              example: "+234 800 123 4567",
              description: "Phone number with country code",
            },
            country: {
              type: "string",
              example: "Nigeria",
              description: "Country of residence",
            },
            participantType: {
              type: "string",
              enum: ["hardtech", "software", "commercial", "catalyst"],
              example: "software",
              description: "Type of participant profile",
            },
            focusAreas: {
              type: "array",
              items: {
                type: "string",
                enum: ["healthcare", "energy", "agriculture"],
              },
              example: ["healthcare", "energy"],
              description: "Selected focus areas (1-3)",
            },
            experience: {
              type: "string",
              example: "5 years of experience in mobile health applications...",
              description: "Relevant experience and background",
            },
            motivation: {
              type: "string",
              example: "I want to solve maternal health challenges in rural Nigeria...",
              description: "Why you want to participate",
            },
            idea: {
              type: "string",
              example: "A mobile-first telemedicine platform for rural clinics...",
              description: "Brief description of your idea (optional)",
            },
          },
        },
        TeamApplication: {
          type: "object",
          required: ["teamName", "leadEmail", "focusAreas", "motivation"],
          properties: {
            teamName: {
              type: "string",
              example: "HealthTech Innovators",
              description: "Name of the team",
            },
            teamSize: {
              type: "integer",
              minimum: 2,
              maximum: 5,
              example: 4,
              description: "Number of team members",
            },
            teamMembers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Jane Smith" },
                  email: { type: "string", example: "jane@example.com" },
                  role: { type: "string", example: "Lead Developer" },
                  participantType: {
                    type: "string",
                    enum: ["hardtech", "software", "commercial", "catalyst"],
                  },
                },
              },
              description: "List of team members",
            },
            leadName: {
              type: "string",
              example: "John Doe",
              description: "Team lead full name",
            },
            leadEmail: {
              type: "string",
              format: "email",
              example: "john@example.com",
              description: "Team lead email address",
            },
            focusAreas: {
              type: "array",
              items: {
                type: "string",
                enum: ["healthcare", "energy", "agriculture"],
              },
              example: ["agriculture"],
              description: "Selected focus areas",
            },
            experience: {
              type: "string",
              description: "Team's collective experience",
            },
            motivation: {
              type: "string",
              description: "Why your team wants to participate",
            },
            idea: {
              type: "string",
              description: "Brief description of your team's idea",
            },
          },
        },
        Application: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            type: {
              type: "string",
              enum: ["individual", "team"],
            },
            status: {
              type: "string",
              enum: ["pending", "reviewing", "shortlisted", "accepted", "rejected"],
              default: "pending",
            },
            submittedAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        StatusUpdate: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["pending", "reviewing", "shortlisted", "accepted", "rejected"],
              example: "shortlisted",
            },
            notes: {
              type: "string",
              example: "Strong technical background, proceed to interview",
              description: "Internal notes about the status change",
            },
          },
        },
        Stats: {
          type: "object",
          properties: {
            overview: {
              type: "object",
              properties: {
                total: { type: "integer", example: 150 },
                individuals: { type: "integer", example: 100 },
                teams: { type: "integer", example: 50 },
              },
            },
            byStatus: {
              type: "object",
              example: {
                pending: 80,
                reviewing: 40,
                shortlisted: 20,
                accepted: 10,
              },
            },
            byFocusArea: {
              type: "object",
              example: {
                healthcare: 60,
                energy: 50,
                agriculture: 40,
              },
            },
            byParticipantType: {
              type: "object",
              example: {
                software: 40,
                hardtech: 30,
                commercial: 20,
                catalyst: 10,
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Missing required fields",
            },
            message: {
              type: "string",
              example: "fullName, email, participantType, focusAreas are required",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            total: { type: "integer", example: 150 },
            pages: { type: "integer", example: 8 },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/server.js"],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
