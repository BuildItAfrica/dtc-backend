const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
    index: true,
  },
  voterEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model("Vote", VoteSchema);
