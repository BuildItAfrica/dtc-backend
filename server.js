require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const swaggerUi = require("swagger-ui-express")

const { connectDB } = require("./config/database")
const swaggerSpec = require("./config/swagger")
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware")

// Routes
const applicationRoutes = require("./routes/applications")
const statsRoutes = require("./routes/stats")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL_1 || process.env.FRONTEND_URL_2 || process.env.FRONTEND_URL_3 || "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(morgan("dev"))
app.use(express.json())

// Swagger Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "DTC 2026 API Documentation",
  }),
)

app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerSpec)
})

// API Routes
app.use("/api/applications", applicationRoutes)
app.use("/api/stats", statsRoutes)

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  })
})

// Error Handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start Server
const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`DTC Backend API running on http://localhost:${PORT}`)
      console.log(`Swagger Docs available at http://localhost:${PORT}/api/docs`)
    })
  } catch (error) {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()
