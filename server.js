require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const swaggerUi = require("swagger-ui-express")

const { connectDB } = require("./config/database")
const swaggerSpec = require("./config/swagger")
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware")

const applicationRoutes = require("./routes/applications")
const authRoutes = require("./routes/auth.routes")
const statsRoutes = require("./routes/stats")

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://www.dtc.com.ng", "https://admin.dtc.com.ng", "https://dtc-admin-1.onrender.com", "https://dtc.com.ng"],
  credentials: true,
}))
app.use(morgan("dev"))
app.use(express.json())

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".topbar { display: none }",
  customSiteTitle: "DTC 2026 Admin API",
  swaggerOptions: { persistAuthorization: true },
}))

// Routes
app.use("/api/applications", applicationRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/stats", statsRoutes)

// Health
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "DTC 2026 API is running!" })
})

app.get("/", (req, res) => res.redirect("/api/docs"))

app.use(notFoundHandler)
app.use(errorHandler)

const start = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`\nDTC 2026 Backend Running on http://localhost:${PORT}`)
      console.log(`Swagger: http://localhost:${PORT}/api/docs\n`)
    })
  } catch (err) {
    console.error("Failed to start:", err)
    process.exit(1)
  }
}

start()