const Application = require("../models/Application")

class ApplicationService {
  // Create individual application
  async createIndividual(data) {
    const existing = await Application.findOne({
      email: data.email,
      type: "individual",
    })

    if (existing) {
      const error = new Error("An application with this email already exists")
      error.statusCode = 409
      throw error
    }

    const application = new Application({
      type: "individual",
      ...data,
    })

    return await application.save()
  }

  // Create team application
  async createTeam(data) {
    const existing = await Application.findOne({
      $or: [
        { teamName: data.teamName, type: "team" },
        { email: data.leadEmail, type: "team" },
      ],
    })

    if (existing) {
      const error = new Error("A team with this name or lead email already exists")
      error.statusCode = 409
      throw error
    }

    const application = new Application({
      type: "team",
      email: data.leadEmail,
      ...data,
    })

    return await application.save()
  }

  // Get all applications with filters and pagination
  async getAll(filters = {}, options = {}) {
    const { type, status, focusArea } = filters
    const { page = 1, limit = 20, sort = "-submittedAt" } = options

    const query = {}
    if (type) query.type = type
    if (status) query.status = status
    if (focusArea) query.focusAreas = focusArea

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const [applications, total] = await Promise.all([
      Application.find(query).sort(sort).skip(skip).limit(Number.parseInt(limit)),
      Application.countDocuments(query),
    ])

    return {
      applications,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
    }
  }

  // Get single application by ID
  async getById(id) {
    const application = await Application.findById(id)

    if (!application) {
      const error = new Error("Application not found")
      error.statusCode = 404
      throw error
    }

    return application
  }

  // Update application status
  async updateStatus(id, status, notes) {
    const validStatuses = ["pending", "reviewing", "shortlisted", "accepted", "rejected"]

    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
      error.statusCode = 400
      throw error
    }

    const update = { status, updatedAt: new Date() }
    if (notes) update.notes = notes

    const application = await Application.findByIdAndUpdate(id, update, { new: true })

    if (!application) {
      const error = new Error("Application not found")
      error.statusCode = 404
      throw error
    }

    return application
  }

  // Delete application
  async delete(id) {
    const application = await Application.findByIdAndDelete(id)

    if (!application) {
      const error = new Error("Application not found")
      error.statusCode = 404
      throw error
    }

    return application
  }
}

module.exports = new ApplicationService()
