const statsService = require("../services/stats.service")

class StatsController {
  // GET /api/stats
  async getStats(req, res, next) {
    try {
      const stats = await statsService.getStats()

      res.json({
        success: true,
        data: stats,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new StatsController()
