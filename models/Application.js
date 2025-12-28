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

  // === COMMON REQUIRED FIELDS ===
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: [18, "You must be at least 18 years old"],
    max: [100, "Age must be realistic"],
  },

  // === NEW OPTIONAL PERSONAL FIELDS (for individual or team lead) ===
  sex: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
    default: null,
  },

  education: {
    type: String,
    enum: [
      "High School",
      "Some College",
      "Associate Degree",
      "Bachelor's Degree",
      "Master's Degree",
      "PhD or Doctorate",
      "Vocational/Technical Training",
      "Prefer not to say",
    ],
    default: null,
  },

  // === INDIVIDUAL FIELDS ===
  fullName: {
    type: String,
    required: function () {
      return this.type === "individual"
    },
  },
  email: {
    type: String,
    required: function () {
      return this.type === "individual"
    },
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: function () {
      return this.type === "individual"
    },
  },
  participantType: {
    type: String,
    enum: ["hardtech", "software", "commercial", "catalyst"],
    required: function () {
      return this.type === "individual"
    },
  },

  // === TEAM FIELDS ===
  teamName: {
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
  },

  teamMembers: {
    type: [teamMemberSchema],
    required: function () {
      return this.type === "team"
    },
    validate: {
      validator: function (members) {
        if (this.type !== "team") return true;
        return Array.isArray(members) && members.length >= 1 && members.length <= 10;
      },
      message: "Team must have between 1 and 10 members",
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

  // === COMMON FIELDS ===
  focusAreas: [
    {
      type: String,
      enum: ["healthcare", "energy", "agriculture"],
      required: true,
    },
  ],
  experience: { type: String, required: true },
  motivation: { type: String, required: true },
  idea: { type: String },

  // === METADATA ===
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: String,
})

// Indexes
applicationSchema.index({ email: 1, type: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ focusAreas: 1 })
applicationSchema.index({ submittedAt: -1 })
applicationSchema.index({ country: 1, city: 1 })

// Update timestamp on save
applicationSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model("Application", applicationSchema)
















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

//   // === COMMON REQUIRED FIELDS ===
//   country: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   city: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   age: {
//     type: Number,
//     required: true,
//     min: [18, "You must be at least 18 years old"],
//     max: [100, "Age must be realistic"],
//   },

//   // === INDIVIDUAL FIELDS ===
//   fullName: {
//     type: String,
//     required: function () {
//       return this.type === "individual"
//     },
//   },
//   email: {
//     type: String,
//     required: function () {
//       return this.type === "individual"
//     },
//     lowercase: true,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     required: function () {
//       return this.type === "individual"
//     },
//   },
//   participantType: {
//     type: String,
//     enum: ["hardtech", "software", "commercial", "catalyst"],
//     required: function () {
//       return this.type === "individual"
//     },
//   },

//   // === TEAM FIELDS ===
//   teamName: {
//     type: String,
//     required: function () {
//       return this.type === "team"
//     },
//   },
//   teamSize: {
//     type: Number,
//     required: function () {
//       return this.type === "team"
//     },
//   },

//   teamMembers: {
//     type: [teamMemberSchema],
//     required: function () {
//       return this.type === "team"
//     },
//     validate: {
//       validator: function (members) {
//         // Skip validation for individual applications
//         if (this.type !== "team") return true;

//         // Validate team members count only for team applications
//         return Array.isArray(members) && members.length >= 1 && members.length <= 10;
//       },
//       message: "Team must have between 1 and 10 members",
//     },
//   },

//   leadName: {
//     type: String,
//     required: function () {
//       return this.type === "team"
//     },
//   },
//   leadEmail: {
//     type: String,
//     required: function () {
//       return this.type === "team"
//     },
//     lowercase: true,
//     trim: true,
//   },
//   leadPhone: {
//     type: String,
//     required: function () {
//       return this.type === "team"
//     },
//   },

//   // === COMMON FIELDS ===
//   focusAreas: [
//     {
//       type: String,
//       enum: ["healthcare", "energy", "agriculture"],
//       required: true,
//     },
//   ],
//   experience: { type: String, required: true },
//   motivation: { type: String, required: true },
//   idea: { type: String },

//   // === METADATA ===
//   submittedAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   notes: String,
// })

// // Indexes
// applicationSchema.index({ email: 1, type: 1 })
// applicationSchema.index({ status: 1 })
// applicationSchema.index({ focusAreas: 1 })
// applicationSchema.index({ submittedAt: -1 })
// applicationSchema.index({ country: 1, city: 1 })

// // Update timestamp on save
// applicationSchema.pre("save", function (next) {
//   this.updatedAt = new Date()
//   next()
// })

// module.exports = mongoose.model("Application", applicationSchema)




// const mongoose = require("mongoose")

// const teamMemberSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   role: { type: String, required: true },
// })

// const questionnaireSchema = new mongoose.Schema({
//   // 1. Motivation and Vision
//   motivationDraw: { type: String }, // Q1 (~100 words)
//   specificProblem: { type: String }, // Q2 (~100 words)

//   // 2. Sector-Specific Challenge
//   pressingIssue: { type: String }, // Q1 (~100 words)
//   proposedIdea: { type: String }, // Q2 (~100 words)
//   userNeedsAddressed: { type: String }, // Q3 (~100 words)

//   // 3. Skills and Expertise
//   profileDescription: { type: String }, // Q1 (~250 words)
//   tangibleOutcome: { type: String }, // Q2 (~250 words)

//   // 4. Design Thinking Alignment
//   dtExperience: { type: String }, // Q1 (~100 words)
//   dtLessonLearned: { type: String }, // Q2 (~250 words)

//   // 5. Team and Collaboration Potential
//   collaborationStyle: { type: String }, // Q1 (~100 words)
//   teamContribution: { type: String }, // Q2 (~100 words)

//   // 6. Ambition and Impact
//   longTermImpact: { type: String }, // Q1 (~100 words)
//   careerAlignmentAndPerspective: { type: String }, // Q2 (~250 words)

//   // 7. Commitment and Readiness
//   availability: { type: String }, // Q1 (~100 words)
//   risksAndMomentum: { type: String }, // Q2 (~100 words)
// }, { _id: false })

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

//   // Common fields - KEEPING ALL EXISTING
//   focusAreas: [
//     {
//       type: String,
//       enum: ["healthcare", "energy", "agriculture"],
//     },
//   ], // Still an array – supports multiple or single
//   experience: String,
//   motivation: String,
//   idea: String,

//   // NEW: Structured questionnaire for DTC 2026
//   questionnaire: questionnaireSchema,

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