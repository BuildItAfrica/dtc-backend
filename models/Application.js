const mongoose = require("mongoose")

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
})

const applicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["individual", "team"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "reviewing", "shortlisted", "accepted", "rejected"],
    default: "pending",
  },

  // Individual fields
  fullName: String,
  email: { type: String, required: true },
  phone: String,
  country: String,
  participantType: {
    type: String,
    enum: ["hardtech", "software", "commercial", "catalyst"],
  },

  // Team fields
  teamName: String,
  teamSize: Number,
  teamMembers: [teamMemberSchema],
  leadName: String,
  leadEmail: String,

  // Common fields
  focusAreas: [
    {
      type: String,
      enum: ["healthcare", "energy", "agriculture"],
    },
  ],
  experience: String,
  motivation: String,
  idea: String,

  // Metadata
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: String,
})

applicationSchema.index({ email: 1, type: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ focusAreas: 1 })
applicationSchema.index({ submittedAt: -1 })

applicationSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model("Application", applicationSchema)
