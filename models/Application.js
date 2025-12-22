// const mongoose = require("mongoose")

// const teamMemberSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   role: { type: String, required: true },
// })

// const applicationSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["individual", "team"],
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "reviewing", "shortlisted", "accepted", "rejected"],
//     default: "pending",
//   },

//   // Individual fields
//   fullName: String,
//   email: { type: String, required: true },
//   phone: String,
//   country: String,
//   participantType: {
//     type: String,
//     enum: ["hardtech", "software", "commercial", "catalyst"],
//   },

//   // Team fields
//   teamName: String,
//   teamSize: Number,
//   teamMembers: [teamMemberSchema],
//   leadName: String,
//   leadEmail: String,

//   // Common fields
//   focusAreas: [
//     {
//       type: String,
//       enum: ["healthcare", "energy", "agriculture"],
//     },
//   ],
//   experience: String,
//   motivation: String,
//   idea: String,

//   // Metadata
//   submittedAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   notes: String,
// })

// applicationSchema.index({ email: 1, type: 1 })
// applicationSchema.index({ status: 1 })
// applicationSchema.index({ focusAreas: 1 })
// applicationSchema.index({ submittedAt: -1 })

// applicationSchema.pre("save", function (next) {
//   this.updatedAt = new Date()
//   next()
// })

// module.exports = mongoose.model("Application", applicationSchema)








const mongoose = require("mongoose")

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
})

const questionnaireSchema = new mongoose.Schema({
  // 1. Motivation and Vision
  motivationDraw: { type: String }, // Q1 (~100 words)
  specificProblem: { type: String }, // Q2 (~100 words)

  // 2. Sector-Specific Challenge
  pressingIssue: { type: String }, // Q1 (~100 words)
  proposedIdea: { type: String }, // Q2 (~100 words)
  userNeedsAddressed: { type: String }, // Q3 (~100 words)

  // 3. Skills and Expertise
  profileDescription: { type: String }, // Q1 (~250 words)
  tangibleOutcome: { type: String }, // Q2 (~250 words)

  // 4. Design Thinking Alignment
  dtExperience: { type: String }, // Q1 (~100 words)
  dtLessonLearned: { type: String }, // Q2 (~250 words)

  // 5. Team and Collaboration Potential
  collaborationStyle: { type: String }, // Q1 (~100 words)
  teamContribution: { type: String }, // Q2 (~100 words)

  // 6. Ambition and Impact
  longTermImpact: { type: String }, // Q1 (~100 words)
  careerAlignmentAndPerspective: { type: String }, // Q2 (~250 words)

  // 7. Commitment and Readiness
  availability: { type: String }, // Q1 (~100 words)
  risksAndMomentum: { type: String }, // Q2 (~100 words)
}, { _id: false })

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

  // Common fields - KEEPING ALL EXISTING
  focusAreas: [
    {
      type: String,
      enum: ["healthcare", "energy", "agriculture"],
    },
  ], // Still an array – supports multiple or single
  experience: String,
  motivation: String,
  idea: String,

  // NEW: Structured questionnaire for DTC 2026
  questionnaire: questionnaireSchema,

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