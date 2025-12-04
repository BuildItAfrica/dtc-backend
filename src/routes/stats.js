const express = require("express")
const router = express.Router()
const statsController = require("../controllers/stats.controller")

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get application statistics for dashboard
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Statistics overview
 */
router.get("/", statsController.getStats.bind(statsController))

module.exports = router
