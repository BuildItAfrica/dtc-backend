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

















// const applicationService = require("../services/application.service");

// class ApplicationController {
//   // POST /api/applications/individual
//   async createIndividual(req, res, next) {
//     try {
//       const {
//         fullName,
//         email,
//         phone,
//         country,
//         participantType,
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//         questionnaire, // New structured responses for DTC 2026
//       } = req.body;

//       // Existing required fields validation
//       if (!fullName || !email || !participantType || !focusAreas?.length) {
//         return res.status(400).json({
//           success: false,
//           error: "Missing required fields: fullName, email, participantType, focusAreas",
//         });
//       }

//       // Optional: Enforce questionnaire for applications submitted during DTC 2026 period
//       // Current date is December 22, 2025 → submission deadline is Dec 30, 2025
//       const submissionDate = new Date();
//       const dtcStartDate = new Date("2025-11-01"); // Adjust if needed
//       const dtcDeadline = new Date("2025-12-30");

//       if (submissionDate >= dtcStartDate && submissionDate <= dtcDeadline) {
//         if (!questionnaire) {
//           return res.status(400).json({
//             success: false,
//             error: "Detailed questionnaire is required for Design Thinking Challenge 2026 applications.",
//           });
//         }

//         // Validate all required questionnaire fields
//         const requiredFields = [
//           "motivationDraw",
//           "specificProblem",
//           "pressingIssue",
//           "proposedIdea",
//           "userNeedsAddressed",
//           "profileDescription",
//           "tangibleOutcome",
//           "dtExperience",
//           "dtLessonLearned",
//           "collaborationStyle",
//           "teamContribution",
//           "longTermImpact",
//           "careerAlignmentAndPerspective",
//           "availability",
//           "risksAndMomentum",
//         ];

//         const missing = requiredFields.filter(
//           (field) => !questionnaire[field]?.trim()
//         );

//         if (missing.length > 0) {
//           return res.status(400).json({
//             success: false,
//             error: `Missing questionnaire fields: ${missing.join(", ")}`,
//           });
//         }
//       }

//       const application = await applicationService.createIndividual({
//         fullName,
//         email,
//         phone,
//         country,
//         participantType,
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//         questionnaire,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Application submitted successfully",
//         data: { applicationId: application._id },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // POST /api/applications/team
//   async createTeam(req, res, next) {
//     try {
//       const {
//         teamName,
//         teamSize,
//         teamMembers,
//         leadName,
//         leadEmail,
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//         questionnaire, // Same structured questionnaire for team applications
//       } = req.body;

//       // Existing validation
//       if (!teamName || !leadEmail || !focusAreas?.length) {
//         return res.status(400).json({
//           success: false,
//           error: "Missing required fields: teamName, leadEmail, focusAreas",
//         });
//       }

//       // Enforce questionnaire during DTC 2026 application window
//       const submissionDate = new Date();
//       const dtcStartDate = new Date("2025-11-01");
//       const dtcDeadline = new Date("2025-12-30");

//       if (submissionDate >= dtcStartDate && submissionDate <= dtcDeadline) {
//         if (!questionnaire) {
//           return res.status(400).json({
//             success: false,
//             error: "Detailed questionnaire is required for Design Thinking Challenge 2026 team applications.",
//           });
//         }

//         const requiredFields = [
//           "motivationDraw",
//           "specificProblem",
//           "pressingIssue",
//           "proposedIdea",
//           "userNeedsAddressed",
//           "profileDescription",
//           "tangibleOutcome",
//           "dtExperience",
//           "dtLessonLearned",
//           "collaborationStyle",
//           "teamContribution",
//           "longTermImpact",
//           "careerAlignmentAndPerspective",
//           "availability",
//           "risksAndMomentum",
//         ];

//         const missing = requiredFields.filter(
//           (field) => !questionnaire[field]?.trim()
//         );

//         if (missing.length > 0) {
//           return res.status(400).json({
//             success: false,
//             error: `Missing questionnaire fields: ${missing.join(", ")}`,
//           });
//         }
//       }

//       const application = await applicationService.createTeam({
//         teamName,
//         teamSize,
//         teamMembers,
//         leadName,
//         leadEmail,
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//         questionnaire,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Team application submitted successfully",
//         data: { applicationId: application._id },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // GET /api/applications
//   async getAll(req, res, next) {
//     try {
//       const { type, status, focusArea, page, limit, sort } = req.query;

//       const result = await applicationService.getAll(
//         { type, status, focusArea },
//         { page, limit, sort }
//       );

//       res.json({
//         success: true,
//         ...result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // GET /api/applications/:id
//   async getById(req, res, next) {
//     try {
//       const application = await applicationService.getById(req.params.id);

//       res.json({
//         success: true,
//         data: application,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // PATCH /api/applications/:id/status
//   async updateStatus(req, res, next) {
//     try {
//       const { status, notes } = req.body;
//       const application = await applicationService.updateStatus(
//         req.params.id,
//         status,
//         notes
//       );

//       res.json({
//         success: true,
//         message: "Status updated successfully",
//         data: application,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // DELETE /api/applications/:id
//   async delete(req, res, next) {
//     try {
//       await applicationService.delete(req.params.id);

//       res.json({
//         success: true,
//         message: "Application deleted successfully",
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// module.exports = new ApplicationController();