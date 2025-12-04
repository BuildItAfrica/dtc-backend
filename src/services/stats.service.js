const Application = require("../models/Application")

class StatsService {
  async getStats() {
    const [total, individuals, teams, byStatus, byFocusArea, byParticipantType, recentApplications] = await Promise.all(
      [
        Application.countDocuments(),
        Application.countDocuments({ type: "individual" }),
        Application.countDocuments({ type: "team" }),
        Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Application.aggregate([{ $unwind: "$focusAreas" }, { $group: { _id: "$focusAreas", count: { $sum: 1 } } }]),
        Application.aggregate([
          { $match: { type: "individual" } },
          { $group: { _id: "$participantType", count: { $sum: 1 } } },
        ]),
        Application.find()
          .sort("-submittedAt")
          .limit(10)
          .select("type fullName teamName email status submittedAt focusAreas"),
      ],
    )

    return {
      overview: { total, individuals, teams },
      byStatus: this._arrayToObject(byStatus),
      byFocusArea: this._arrayToObject(byFocusArea),
      byParticipantType: this._arrayToObject(byParticipantType),
      recentApplications,
    }
  }

  _arrayToObject(arr) {
    return arr.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {})
  }
}

module.exports = new StatsService()
