require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const { connectDB } = require("./config/database");
const swaggerSpec = require("./config/swagger");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");

const applicationRoutes = require("./routes/applications");
const authRoutes = require("./routes/auth.routes");
const statsRoutes = require("./routes/stats");
const votingRoutes = require("./routes/voting.routes");

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * ====================================
 * CORS CONFIGURATION
 * ====================================
 */
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://www.dtc.com.ng",
    "https://admin.dtc.com.ng",
    "https://dtc-admin-1.onrender.com",
    "https://dtc.com.ng",
    "https://improved-meme-67w5w5j79j5c5rjg-3000.app.github.dev",
    "https://upgraded-acorn-wjx5x5w4pxphg6v7-3000.app.github.dev",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

/**
 * ====================================
 * GLOBAL MIDDLEWARE
 * ====================================
 */
app.use(helmet());

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔑 REQUIRED for preflight requests

app.use(morgan("dev"));
app.use(express.json());

/**
 * ====================================
 * SWAGGER DOCUMENTATION
 * ====================================
 */
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".topbar { display: none }",
    customSiteTitle: "DTC 2026 Admin API",
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

/**
 * ====================================
 * API ROUTES
 * ====================================
 */
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/votes", votingRoutes);

/**
 * ====================================
 * HEALTH CHECK
 * ====================================
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DTC 2026 API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

/**
 * ====================================
 * ROOT REDIRECT
 * ====================================
 */
app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

/**
 * ====================================
 * ERROR HANDLING
 * ====================================
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * ====================================
 * SERVER START
 * ====================================
 */
const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("\n====================================");
      console.log(`🚀 DTC 2026 Backend Running`);
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`📘 Swagger: http://localhost:${PORT}/api/docs`);
      console.log("====================================\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start();
