// const Application = require("../models/Application")

// class ApplicationService {
//   // Create individual application
//   async createIndividual(data) {
//     const existing = await Application.findOne({
//       email: data.email,
//       type: "individual",
//     })

//     if (existing) {
//       const error = new Error("An application with this email already exists")
//       error.statusCode = 409
//       throw error
//     }

//     const application = new Application({
//       type: "individual",
//       ...data,
//     })

//     return await application.save()
//   }

//   // Create team application
//   async createTeam(data) {
//     const existing = await Application.findOne({
//       $or: [
//         { teamName: data.teamName, type: "team" },
//         { email: data.leadEmail, type: "team" },
//       ],
//     })

//     if (existing) {
//       const error = new Error("A team with this name or lead email already exists")
//       error.statusCode = 409
//       throw error
//     }

//     const application = new Application({
//       type: "team",
//       email: data.leadEmail,
//       ...data,
//     })

//     return await application.save()
//   }

//   // Get all applications with filters and pagination
//   async getAll(filters = {}, options = {}) {
//     const { type, status, focusArea } = filters
//     const { page = 1, limit = 20, sort = "-submittedAt" } = options

//     const query = {}
//     if (type) query.type = type
//     if (status) query.status = status
//     if (focusArea) query.focusAreas = focusArea

//     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

//     const [applications, total] = await Promise.all([
//       Application.find(query).sort(sort).skip(skip).limit(Number.parseInt(limit)),
//       Application.countDocuments(query),
//     ])

//     return {
//       applications,
//       pagination: {
//         page: Number.parseInt(page),
//         limit: Number.parseInt(limit),
//         total,
//         pages: Math.ceil(total / Number.parseInt(limit)),
//       },
//     }
//   }

//   // Get single application by ID
//   async getById(id) {
//     const application = await Application.findById(id)

//     if (!application) {
//       const error = new Error("Application not found")
//       error.statusCode = 404
//       throw error
//     }

//     return application
//   }

//   // Update application status
//   async updateStatus(id, status, notes) {
//     const validStatuses = ["pending", "reviewing", "shortlisted", "accepted", "rejected"]

//     if (!validStatuses.includes(status)) {
//       const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
//       error.statusCode = 400
//       throw error
//     }

//     const update = { status, updatedAt: new Date() }
//     if (notes) update.notes = notes

//     const application = await Application.findByIdAndUpdate(id, update, { new: true })

//     if (!application) {
//       const error = new Error("Application not found")
//       error.statusCode = 404
//       throw error
//     }

//     return application
//   }

//   // Delete application
//   async delete(id) {
//     const application = await Application.findByIdAndDelete(id)

//     if (!application) {
//       const error = new Error("Application not found")
//       error.statusCode = 404
//       throw error
//     }

//     return application
//   }
// }

// module.exports = new ApplicationService()



















// const Application = require("../models/Application");

// class ApplicationService {
//   // Create individual application
//   async createIndividual(data) {
//     const { email, questionnaire } = data;

//     // Check for duplicate individual application by email
//     const existing = await Application.findOne({
//       email: email,
//       type: "individual",
//     });

//     if (existing) {
//       const error = new Error("An individual application with this email already exists");
//       error.statusCode = 409;
//       throw error;
//     }

//     const application = new Application({
//       type: "individual",
//       ...data, // spreads all fields: fullName, email, phone, country, participantType,
//                // focusAreas, experience, motivation, idea, questionnaire, etc.
//     });

//     return await application.save();
//   }

//   // Create team application
//   async createTeam(data) {
//     const { teamName, leadEmail, questionnaire } = data;

//     // Check for duplicate team by teamName OR leadEmail
//     const existing = await Application.findOne({
//       $or: [
//         { teamName: teamName, type: "team" },
//         { leadEmail: leadEmail, type: "team" },
//       ],
//     });

//     if (existing) {
//       const error = new Error("A team application with this team name or lead email already exists");
//       error.statusCode = 409;
//       throw error;
//     }

//     const application = new Application({
//       type: "team",
//       // For team applications, we store the lead's email as the main email for consistency in queries/filters
//       email: leadEmail,
//       ...data, // spreads teamName, teamSize, teamMembers, leadName, leadEmail,
//                // focusAreas, experience, motivation, idea, questionnaire, etc.
//     });

//     return await application.save();
//   }

//   // Get all applications with filters and pagination
//   async getAll(filters = {}, options = {}) {
//     const { type, status, focusArea } = filters;
//     const { page = 1, limit = 20, sort = "-submittedAt" } = options;

//     const query = {};
//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (focusArea) query.focusAreas = focusArea; // works with array field

//     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

//     const [applications, total] = await Promise.all([
//       Application.find(query)
//         .sort(sort)
//         .skip(skip)
//         .limit(Number.parseInt(limit)),
//       Application.countDocuments(query),
//     ]);

//     return {
//       applications,
//       pagination: {
//         page: Number.parseInt(page),
//         limit: Number.parseInt(limit),
//         total,
//         pages: Math.ceil(total / Number.parseInt(limit)),
//       },
//     };
//   }

//   // Get single application by ID
//   async getById(id) {
//     const application = await Application.findById(id);

//     if (!application) {
//       const error = new Error("Application not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     return application;
//   }

//   // Update application status (and optionally add notes)
//   async updateStatus(id, status, notes) {
//     const validStatuses = ["pending", "reviewing", "shortlisted", "accepted", "rejected"];

//     if (!validStatuses.includes(status)) {
//       const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
//       error.statusCode = 400;
//       throw error;
//     }

//     const update = { status, updatedAt: new Date() };
//     if (notes !== undefined && notes !== null) {
//       update.notes = notes;
//     }

//     const application = await Application.findByIdAndUpdate(id, update, { new: true });

//     if (!application) {
//       const error = new Error("Application not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     return application;
//   }

//   // Delete application
//   async delete(id) {
//     const application = await Application.findByIdAndDelete(id);

//     if (!application) {
//       const error = new Error("Application not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     return application;
//   }
// }

// module.exports = new ApplicationService();









// services/application.service.js
const Application = require("../models/Application");
const ApplicationScore = require("../models/ApplicationScore");
const { computeTotal } = require("../utils/score");
const { WEIGHTS } = require("../config/weights");
const { sendStatusUpdateEmail } = require("../utils/sendEmail");
const { sendBulkCustomEmail } = require("../utils/sendBulkCustomEmail");

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


class ApplicationService {

    constructor() {
    this.cachedScores = null;
    this.lastCacheTime = 0;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 min
  }




  // Create individual application
  async createIndividual(data) {
    const { email } = data;

    // Check for duplicate individual application by email
    const existing = await Application.findOne({
      email: email,
      type: "individual",
    });

    if (existing) {
      const error = new Error("An individual application with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const application = new Application({
      type: "individual",
      ...data,
    });

    return await application.save();
  }

  // Create team application
  async createTeam(data) {
    const { teamName, leadEmail } = data;

    // Check for duplicate team by teamName OR leadEmail
    const existing = await Application.findOne({
      $or: [
        { teamName: teamName, type: "team" },
        { leadEmail: leadEmail, type: "team" },
      ],
    });

    if (existing) {
      const error = new Error("A team application with this team name or lead email already exists");
      error.statusCode = 409;
      throw error;
    }

    const application = new Application({
      type: "team",
      email: leadEmail,
      ...data,
    });

    return await application.save();
  }

  // Get all applications with filters and pagination
  async getAll(filters = {}, options = {}) {
    const { type, status, focusArea } = filters;
    const { page = 1, limit = 20, sort = "-submittedAt" } = options;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (focusArea) query.focusAreas = focusArea;

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number.parseInt(limit)),
      Application.countDocuments(query),
    ]);

    return {
      applications,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
    };
  }

  // Get single application by ID
  async getById(id) {
    const application = await Application.findById(id);

    if (!application) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    return application;
  }

  // Update application status (and optionally add notes)
async updateStatus(id, status, notes) {
    const validStatuses = ["pending", "reviewing", "shortlisted", "accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    // Fetch current application to know old status
    const currentApplication = await Application.findById(id);
    if (!currentApplication) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = currentApplication.status;
    console.log(`\n🔄 STATUS UPDATE REQUEST`);
    console.log(`   Application ID: ${id}`);
    console.log(`   Old Status: ${oldStatus}`);
    console.log(`   New Status: ${status}`);
    if (notes) console.log(`   Admin Notes: ${notes}`);

    const update = { status, updatedAt: new Date() };
    if (notes && notes.trim() !== "") {
      update.notes = notes.trim();
    }

    const application = await Application.findByIdAndUpdate(id, update, { new: true });

    if (!application) {
      const error = new Error("Application not found after update");
      error.statusCode = 404;
      throw error;
    }

    console.log(`✅ STATUS SUCCESSFULLY UPDATED: ${oldStatus} → ${application.status}`);

    // === SEND EMAIL ON ANY IMPORTANT STATUS CHANGE ===
    const emailStatuses = ["reviewing", "shortlisted", "accepted", "rejected"];

    if (emailStatuses.includes(application.status) && application.status !== oldStatus) {
      const fullName = application.fullName || application.leadName || "Applicant";
      const teamName = application.teamName;
      const recipientEmail = application.email || application.leadEmail;

      if (!recipientEmail) {
        console.warn(`⚠️  No email address found for this application — skipping email`);
        return application;
      }

      console.log(`📧 PREPARING TO SEND EMAIL`);
      console.log(`   To: ${recipientEmail}`);
      console.log(`   Name: ${fullName}${teamName ? ` (Team: ${teamName})` : ""}`);
      console.log(`   Status: ${application.status}`);

      const adminNotes = (application.status === "rejected" && notes) ? notes : null;

      try {
        await sendStatusUpdateEmail(recipientEmail, fullName, application.status, teamName, adminNotes);
        console.log(`🎉 EMAIL SENT SUCCESSFULLY for status: ${application.status}`);
      } catch (emailError) {
        console.error(`❌ EMAIL FAILED for ${recipientEmail}`);
        console.error(`   Error:`, emailError.message || emailError);
        // Do not throw — status update should not fail because of email
      }
    } else {
      console.log(`ℹ️  No email sent — status change from ${oldStatus} → ${application.status} does not trigger notification`);
    }

    return application;
  }

  // Delete application
  async delete(id) {
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    return application;
  }


  async sendBulkCustomEmail(applicationIds, subject, message) {
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      const error = new Error("applicationIds array is required");
      error.statusCode = 400;
      throw error;
    }

    if (!subject || subject.trim() === "") {
      const error = new Error("Email subject is required");
      error.statusCode = 400;
      throw error;
    }

    if (!message || message.trim() === "") {
      const error = new Error("Email message is required");
      error.statusCode = 400;
      throw error;
    }

    // Fetch valid applications
    const applications = [];
    for (const id of applicationIds) {
      try {
        const app = await this.getById(id);
        if (app) applications.push(app);
      } catch (err) {
        // Skip invalid IDs
        console.warn(`Invalid application ID skipped: ${id}`);
      }
    }

    if (applications.length === 0) {
      const error = new Error("No valid applications found");
      error.statusCode = 404;
      throw error;
    }

    // Send emails
    const result = await sendBulkCustomEmail(applications, subject.trim(), message);

    return result;
  }



  async loadCachedScores() {
    const now = Date.now();
    if (!this.cachedScores || now - this.lastCacheTime > this.CACHE_TTL) {
      const scores = await ApplicationScore.find({}).populate("applicationId");
      this.cachedScores = scores.map(s => ({
        app: s.applicationId,
        scores: s.scores,
      }));
      this.lastCacheTime = now;
    }
    return this.cachedScores;
  }


    // AI query
async aiQuery({ query }) {
  if (!query || !query.trim()) {
    throw { status: 400, message: "Query cannot be empty" };
  }

  const scores = await this.loadCachedScores();

  const prompt = `
You are an assistant for DTC 2026 judges.
Extract these from the query:
- focusArea: healthcare, energy, agriculture (if mentioned)
- minScore: minimum total score (0-100) if mentioned
- limit: number of applicants to return

Query: "${query}"

Respond ONLY in JSON:
{"focusArea": null, "limit": 5, "minScore": 0}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  let parsed;
  try {
    parsed = JSON.parse(response.choices[0].message.content);
  } catch {
    parsed = { focusArea: null, limit: 5, minScore: 0 };
  }

  const { focusArea, limit, minScore } = parsed;

  let filtered = scores;

  if (focusArea) {
    filtered = filtered.filter(f =>
      (f.app.focusAreas || []).includes(focusArea)
    );
  }

  const results = filtered
    .map(f => ({
      app: f.app,
      totalScore: computeTotal(f.scores, WEIGHTS.default),
    }))
    .filter(f => f.totalScore >= minScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit)
    .map(f => f.app);

  return {
    message: `Top ${results.length} applicants matching your criteria.`,
    applicants: results,
  };
}








}

module.exports = new ApplicationService();