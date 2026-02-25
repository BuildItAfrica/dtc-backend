// controllers/application.controller.js
const applicationService = require("../services/application.service")

class ApplicationController {
  // Helper to validate location & age (only for lead/applicant)
  validateLeadInfo({ country, city, age }) {
    if (!country || country.trim() === "") {
      throw new Error("Country is required")
    }
    if (!city || city.trim() === "") {
      throw new Error("City is required")
    }
    if (!age || age < 18) {
      throw new Error("Age is required and you must be at least 18 years old")
    }
  }

  async createIndividual(req, res, next) {
    try {
      const {
        fullName,
        email,
        phone,
        country,
        city,
        age,
        sex,
        education,
        participantType,
        focusAreas,
        experience,
        motivation,
        idea,
      } = req.body

      // Required fields
      if (!fullName || !email || !phone || !participantType || !focusAreas?.length) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: fullName, email, phone, participantType, focusAreas",
        })
      }

      // Enforce country, city, age for individual
      this.validateLeadInfo({ country, city, age })

      const application = await applicationService.createIndividual({
        fullName,
        email,
        phone,
        country: country.trim(),
        city: city.trim(),
        age: Number(age),
        sex: sex || null,
        education: education || null,
        participantType,
        focusAreas,
        experience,
        motivation,
        idea,
      })

      res.status(201).json({
        success: true,
        message: "Individual application submitted successfully",
        data: { applicationId: application._id },
      })
    } catch (error) {
      next(error)
    }
  }

  async createTeam(req, res, next) {
    try {
      const {
        teamName,
        teamSize,
        teamMembers,
        leadName,
        leadEmail,
        leadPhone,
        country,
        city,
        age,
        sex,
        education,
        focusAreas,
        experience,
        motivation,
        idea,
      } = req.body

      // Required team fields
      if (!teamName || !leadName || !leadEmail || !leadPhone || !focusAreas?.length) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: teamName, leadName, leadEmail, leadPhone, focusAreas",
        })
      }

      if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length < 1) {
        return res.status(400).json({
          success: false,
          error: "At least one team member is required",
        })
      }

      // Validate team members
      for (const member of teamMembers) {
        if (!member.name || !member.email || !member.role) {
          return res.status(400).json({
            success: false,
            error: "Each team member must have name, email, and role",
          })
        }
      }

      // Enforce country, city, age for team lead
      this.validateLeadInfo({ country, city, age })

      const application = await applicationService.createTeam({
        teamName,
        teamSize: Number(teamSize),
        teamMembers,
        leadName,
        leadEmail,
        leadPhone,
        country: country.trim(),
        city: city.trim(),
        age: Number(age),
        sex: sex || null,
        education: education || null,
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

  // NEW: Update personal details (sex, education, etc.)
  async updatePersonalInfo(req, res, next) {
    try {
      const { id } = req.params
      const updates = req.body

      // Allowed fields to update
      const allowedUpdates = ["sex", "education", "country", "city", "age", "phone", "leadPhone"]
      const filteredUpdates = {}

      for (const key of allowedUpdates) {
        if (updates[key] !== undefined) {
          filteredUpdates[key] = updates[key]
        }
      }

      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({
          success: false,
          error: "No valid fields provided for update",
        })
      }

      // Optional: re-validate age/country/city if they're being updated
      if (filteredUpdates.age || filteredUpdates.country || filteredUpdates.city) {
        this.validateLeadInfo({
          country: filteredUpdates.country ?? undefined,
          city: filteredUpdates.city ?? undefined,
          age: filteredUpdates.age ?? undefined,
        })
      }

      const updatedApplication = await applicationService.updatePersonalInfo(id, filteredUpdates)

      res.json({
        success: true,
        message: "Personal information updated successfully",
        data: updatedApplication,
      })
    } catch (error) {
      next(error)
    }
  }

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



  async sendBulkCustomEmail(req, res, next) {
    try {
      const { applicationIds, subject, message } = req.body;

      const result = await applicationService.sendBulkCustomEmail(applicationIds, subject, message);

      res.json({
        success: true,
        message: "Bulk email process completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }



  // async aiQuery(req, res, next)
  // {
  //   try{
  //     const { query }  = req.body
  //     if(!query || typeof query !== "string" || query.trim().length === 0)
  //     {
  //       return res.status(400).json({
  //         success: false,
  //         error: "A valid search query is required",
  //       })
  //     }

  //     const result = await applicationService.aiQuery(query);

  //     res.json({
  //       success: true,
  //       message: result.message,
  //       applicants:result.applicants || [],
  //     })
  //   } catch(error){
  //     console.error("AI Controller Error:", error);
  //     next(error);
  //   }
  // }


  // async aiQuery(req, res, next) {
  //   try {
  //     const { query } = req.body;

  //     if (!query || typeof query !== "string" || query.trim().length === 0) {
  //       return res.status(400).json({
  //         success: false,
  //         error: "A valid search query is required",
  //       });
  //     }

  //     const result = await applicationService.aiQuery(query);

  //     res.json({
  //       success: true,
  //       message: result.message,
  //       applicants: result.applicants || [],
  //     });
  //   } catch (error) {
  //     console.error("AI Query Controller Error:", error);
  //     next(error);
  //   }
  // }







}

module.exports = new ApplicationController()











// const applicationService = require("../services/application.service")

// class ApplicationController {
//   // Helper to validate location & age (only for lead/applicant)
//   validateLeadInfo({ country, city, age }) {
//     if (!country || country.trim() === "") {
//       throw new Error("Country is required")
//     }
//     if (!city || city.trim() === "") {
//       throw new Error("City is required")
//     }
//     if (!age || age < 18) {
//       throw new Error("Age is required and you must be at least 18 years old")
//     }
//   }

//   async createIndividual(req, res, next) {
//     try {
//       const {
//         fullName,
//         email,
//         phone,
//         country,
//         city,
//         age,
//         participantType,
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//       } = req.body

//       // Required fields
//       if (!fullName || !email || !phone || !participantType || !focusAreas?.length) {
//         return res.status(400).json({
//           success: false,
//           error: "Missing required fields: fullName, email, phone, participantType, focusAreas",
//         })
//       }

//       // Enforce country, city, age for individual
//       this.validateLeadInfo({ country, city, age })

//       const application = await applicationService.createIndividual({
//         fullName,
//         email,
//         phone,
//         country: country.trim(),
//         city: city.trim(),
//         age: Number(age),
//         participantType,
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//       })

//       res.status(201).json({
//         success: true,
//         message: "Individual application submitted successfully",
//         data: { applicationId: application._id },
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   async createTeam(req, res, next) {
//     try {
//       const {
//         teamName,
//         teamSize,
//         teamMembers,
//         leadName,
//         leadEmail,
//         leadPhone,
//         country,
//         city,
//         age,
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//       } = req.body

//       // Required team fields
//       if (!teamName || !leadName || !leadEmail || !leadPhone || !focusAreas?.length) {
//         return res.status(400).json({
//           success: false,
//           error: "Missing required fields: teamName, leadName, leadEmail, leadPhone, focusAreas",
//         })
//       }

//       if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length < 1) {
//         return res.status(400).json({
//           success: false,
//           error: "At least one team member is required",
//         })
//       }

//       // Validate team members (only name, email, role)
//       for (const member of teamMembers) {
//         if (!member.name || !member.email || !member.role) {
//           return res.status(400).json({
//             success: false,
//             error: "Each team member must have name, email, and role",
//           })
//         }
//       }

//       // Enforce country, city, age ONLY for the TEAM LEAD
//       this.validateLeadInfo({ country, city, age })

//       const application = await applicationService.createTeam({
//         teamName,
//         teamSize: Number(teamSize),
//         teamMembers,
//         leadName,
//         leadEmail,
//         leadPhone,
//         country: country.trim(),
//         city: city.trim(),
//         age: Number(age),
//         focusAreas,
//         experience,
//         motivation,
//         idea,
//       })

//       res.status(201).json({
//         success: true,
//         message: "Team application submitted successfully",
//         data: { applicationId: application._id },
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   async getAll(req, res, next) {
//     try {
//       const { type, status, focusArea, page, limit, sort } = req.query

//       const result = await applicationService.getAll({ type, status, focusArea }, { page, limit, sort })

//       res.json({
//         success: true,
//         ...result,
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   async getById(req, res, next) {
//     try {
//       const application = await applicationService.getById(req.params.id)

//       res.json({
//         success: true,
//         data: application,
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   async updateStatus(req, res, next) {
//     try {
//       const { status, notes } = req.body
//       const application = await applicationService.updateStatus(req.params.id, status, notes)

//       res.json({
//         success: true,
//         message: "Status updated successfully",
//         data: application,
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   async delete(req, res, next) {
//     try {
//       await applicationService.delete(req.params.id)

//       res.json({
//         success: true,
//         message: "Application deleted successfully",
//       })
//     } catch (error) {
//       next(error)
//     }
//   }
// }

// module.exports = new ApplicationController()

















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