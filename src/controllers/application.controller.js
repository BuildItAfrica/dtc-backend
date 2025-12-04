const applicationService = require("../services/application.service")

class ApplicationController {
  // POST /api/applications/individual
  async createIndividual(req, res, next) {
    try {
      const { fullName, email, phone, country, participantType, focusAreas, experience, motivation, idea } = req.body

      // Validation
      if (!fullName || !email || !participantType || !focusAreas?.length) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: fullName, email, participantType, focusAreas",
        })
      }

      const application = await applicationService.createIndividual({
        fullName,
        email,
        phone,
        country,
        participantType,
        focusAreas,
        experience,
        motivation,
        idea,
      })

      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: { applicationId: application._id },
      })
    } catch (error) {
      next(error)
    }
  }

  // POST /api/applications/team
  async createTeam(req, res, next) {
    try {
      const { teamName, teamSize, teamMembers, leadName, leadEmail, focusAreas, experience, motivation, idea } =
        req.body

      // Validation
      if (!teamName || !leadEmail || !focusAreas?.length) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: teamName, leadEmail, focusAreas",
        })
      }

      const application = await applicationService.createTeam({
        teamName,
        teamSize,
        teamMembers,
        leadName,
        leadEmail,
        focusAreas,
        experience,
        motivation,
        idea,
      })

      res.status(201).json({
        success: true,
        message: "Team application submitted successfully",
        data: { applicationId: application._id },
      })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/applications
  async getAll(req, res, next) {
    try {
      const { type, status, focusArea, page, limit, sort } = req.query

      const result = await applicationService.getAll({ type, status, focusArea }, { page, limit, sort })

      res.json({
        success: true,
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/applications/:id
  async getById(req, res, next) {
    try {
      const application = await applicationService.getById(req.params.id)

      res.json({
        success: true,
        data: application,
      })
    } catch (error) {
      next(error)
    }
  }

  // PATCH /api/applications/:id/status
  async updateStatus(req, res, next) {
    try {
      const { status, notes } = req.body
      const application = await applicationService.updateStatus(req.params.id, status, notes)

      res.json({
        success: true,
        message: "Status updated successfully",
        data: application,
      })
    } catch (error) {
      next(error)
    }
  }

  // DELETE /api/applications/:id
  async delete(req, res, next) {
    try {
      await applicationService.delete(req.params.id)

      res.json({
        success: true,
        message: "Application deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ApplicationController()
