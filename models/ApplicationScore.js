// models/ApplicationScore.js
const mongoose = require("mongoose");

const ApplicationScoreSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    unique: true,
    index: true,
  },

  scores: {
    problem: Number,      // 0–25
    innovation: Number,   // 0–20
    feasibility: Number,  // 0–20
    scalability: Number,  // 0–15
    team: Number,         // 0–10
    motivation: Number,   // 0–10
  },

  tags: {
    healthcare: Boolean,
    energy: Boolean,
    agriculture: Boolean,
    climate: Boolean,
    ai: Boolean,
    hardware: Boolean,
    femaleLed: Boolean,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ApplicationScore", ApplicationScoreSchema);