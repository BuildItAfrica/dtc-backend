const mongoose = require("mongoose")

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
})

const projectSchema = new mongoose.Schema(
  {
    // Project type and basic info
    type: {
      type: String,
      enum: ["individual", "team"],
      required: true,
    },

    // Individual project fields
    fullName: {
      type: String,
      required: function () {
        return this.type === "individual"
      },
    },

    // Team project fields
    teamName: {
      type: String,
      required: function () {
        return this.type === "team"
      },
    },
    leadName: {
      type: String,
      required: function () {
        return this.type === "team"
      },
    },
    leadEmail: {
      type: String,
      required: function () {
        return this.type === "team"
      },
      lowercase: true,
      trim: true,
    },
    leadPhone: {
      type: String,
      required: function () {
        return this.type === "team"
      },
    },
    teamSize: {
      type: Number,
      required: function () {
        return this.type === "team"
      },
      min: 1,
      max: 10,
    },
    teamMembers: {
      type: [teamMemberSchema],
      required: function () {
        return this.type === "team"
      },
      validate: {
        validator: function (v) {
          if (this.type === "team") {
            return v && v.length > 0 && v.length <= 10
          }
          return true
        },
        message: "Team must have between 1 and 10 members",
      },
    },

    // Contact info
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },

    // Application/Participant details
    participantType: {
      type: String,
      enum: ["hardtech", "software", "commercial", "catalyst"],
      default: "software",
    },
    experience: {
      type: String,
      default: "",
    },
    motivation: {
      type: String,
      default: "",
    },

    // Demographics
    age: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },

    // Project details (core for voting)
    idea: {
      type: String,
      required: true,
    },
    focusAreas: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v && v.length > 0,
        message: "At least one focus area is required",
      },
    },

    // Timestamps
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Project", projectSchema)
