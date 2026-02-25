// controllers/voting.controller.js
const VotingService = require("../services/voting.service");

class VotingController {
  /**
   * GET /api/votes/candidates
   * Get all published projects for voting display
   */
  async getCandidates(req, res, next) {
    try {
      console.log("getCandidates: Starting to fetch voting results");
      const votingService = new VotingService();
      const results = await votingService.getVotingResults();
      
      console.log("getCandidates: Got results, count:", results.length);
      
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error("getCandidates: Error occurred:", error);
      next(error);
    }
  }

  /**
   * POST /api/votes/submit
   * Submit a vote for an application
   * Body: { applicationId, voterEmail }
   */
  async submitVote(req, res, next) {
    try {
      const { applicationId, voterEmail } = req.body;

      // Validation
      if (!applicationId || !voterEmail) {
        console.warn("[Vote] Missing fields:", { applicationId, voterEmail });
        return res.status(400).json({
          success: false,
          error: "Missing required fields: applicationId, voterEmail",
        });
      }

      if (!voterEmail.includes("@")) {
        console.warn("[Vote] Invalid email format:", voterEmail);
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
      }

      console.log("[Vote] Submitting vote:", { applicationId, voterEmail });
      
      const votingService = new VotingService();
      const vote = await votingService.submitVote(applicationId, voterEmail);

      console.log("[Vote] Vote submitted successfully:", { voteId: vote._id });
      
      res.status(201).json({
        success: true,
        message: "Vote submitted successfully",
        data: { voteId: vote._id },
      });
    } catch (error) {
      // Handle already voted error
      if (error.code === "ALREADY_VOTED") {
        console.log("[Vote] User already voted:", { error: error.message });
        return res.status(409).json({
          success: false,
          error: "You have already voted. Each email can vote once only.",
        });
      }
      
      // Handle duplicate vote error from MongoDB
      if (error.code === 11000) {
        console.log("[Vote] Duplicate vote detected");
        return res.status(409).json({
          success: false,
          error: "You have already voted. Each email can vote once only.",
        });
      }

      // Log unexpected errors
      console.error("[Vote] Error submitting vote:", error);
      next(error);
    }
  }

  /**
   * GET /api/votes/candidate/:applicationId
   * Get vote count and details for a specific application
   */
  async getCandidateVotes(req, res, next) {
    try {
      const { applicationId } = req.params;
      const votingService = new VotingService();

      const voteCount = await votingService.getVoteCount(applicationId);

      res.json({
        success: true,
        data: {
          applicationId,
          voteCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/votes/check-voted
   * Check if a voter has voted
   * Query: { voterEmail }
   */
  async checkUserVoted(req, res, next) {
    try {
      const { voterEmail } = req.query;

      if (!voterEmail) {
        return res.status(400).json({
          success: false,
          error: "Missing required query param: voterEmail",
        });
      }

      const votingService = new VotingService();
      const hasVoted = await votingService.hasVoted(voterEmail);

      res.json({
        success: true,
        data: { hasVoted },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/votes/my-votes
   * Get all applications a voter has voted for
   * Query: { voterEmail }
   */
  async getMyVotes(req, res, next) {
    try {
      const { voterEmail } = req.query;

      if (!voterEmail) {
        return res.status(400).json({
          success: false,
          error: "Missing required query param: voterEmail",
        });
      }

      const votingService = new VotingService();
      const votedApplicationIds = await votingService.getVoterVotes(voterEmail);

      res.json({
        success: true,
        data: { votedApplicationIds },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/votes/results
   * Get all voting results ranked by vote count
   */
  async getResults(req, res, next) {
    try {
      const votingService = new VotingService();
      const results = await votingService.getVotingResults();

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/votes/stats
   * Get voting statistics
   */
  async getStats(req, res, next) {
    try {
      const votingService = new VotingService();
      const stats = await votingService.getVotingStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/votes/clear (Admin only)
   * Clear all votes from the system
   */
  async clearVotes(req, res, next) {
    try {
      const votingService = new VotingService();
      const result = await votingService.clearAllVotes();

      res.json({
        success: true,
        message: "All votes cleared successfully",
        data: { deletedCount: result.deletedCount },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/votes/admin/projects
   * Admin: Get all applications that can be made available for voting
   */
  async adminGetAllProjects(req, res, next) {
    try {
      const Application = require("../models/Application");
      const { status, focusArea, search, page = 1, limit = 10 } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (focusArea) filter.focusAreas = focusArea;

      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { teamName: { $regex: search, $options: "i" } },
          { idea: { $regex: search, $options: "i" } },
        ];
      }

      const skip = (page - 1) * limit;
      const applications = await Application.find(filter)
        .select("type fullName teamName idea focusAreas status createdAt")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Application.countDocuments(filter);

      res.json({
        success: true,
        data: applications,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/votes/admin/projects/:applicationId/accept
   * Admin: Mark an application as accepted for voting
   */
  async adminAcceptProject(req, res, next) {
    try {
      const Application = require("../models/Application");
      const { applicationId } = req.params;

      const application = await Application.findByIdAndUpdate(
        applicationId,
        { status: "accepted" },
        { new: true }
      ).select("type fullName teamName idea focusAreas status");

      if (!application) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      res.json({
        success: true,
        message: "Application marked as accepted for voting",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/votes/admin/projects/:applicationId/reject
   * Admin: Mark an application as rejected (remove from voting)
   */
  async adminRejectProject(req, res, next) {
    try {
      const Application = require("../models/Application");
      const { applicationId } = req.params;

      const application = await Application.findByIdAndUpdate(
        applicationId,
        { status: "rejected" },
        { new: true }
      ).select("type fullName teamName idea focusAreas status");

      if (!application) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      res.json({
        success: true,
        message: "Application marked as rejected",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/votes/admin/projects/:applicationId/shortlist
   * Admin: Mark an application as shortlisted (reviewing)
   */
  async adminShortlistProject(req, res, next) {
    try {
      const Application = require("../models/Application");
      const { applicationId } = req.params;

      const application = await Application.findByIdAndUpdate(
        applicationId,
        { status: "shortlisted" },
        { new: true }
      ).select("type fullName teamName idea focusAreas status");

      if (!application) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      res.json({
        success: true,
        message: "Application marked as shortlisted",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/votes/admin/voting-projects
   * Admin: Get all projects currently available for voting (accepted status)
   */
  async adminGetVotingProjects(req, res, next) {
    try {
      const Application = require("../models/Application");
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;
      const projects = await Application.find({ status: "accepted" })
        .select("type fullName teamName idea focusAreas status createdAt")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Application.countDocuments({ status: "accepted" });

      // Get vote counts for each project
      const votingService = new VotingService();
      const voteCounts = await votingService.getAllVoteCounts();
      const voteCountMap = {};

      voteCounts.forEach((vc) => {
        voteCountMap[vc._id.toString()] = vc.voteCount;
      });

      const projectsWithVotes = projects.map((p) => ({
        ...p.toObject(),
        voteCount: voteCountMap[p._id.toString()] || 0,
      }));

      res.json({
        success: true,
        data: projectsWithVotes,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/votes/admin/stats
   * Admin: Get comprehensive voting statistics
   */
  async adminGetDetailedStats(req, res, next) {
    try {
      const Application = require("../models/Application");
      const votingService = new VotingService();

      const stats = await votingService.getVotingStats();
      const applications = await Application.countDocuments();
      const accepted = await Application.countDocuments({ status: "accepted" });
      const shortlisted = await Application.countDocuments({ status: "shortlisted" });
      const rejected = await Application.countDocuments({ status: "rejected" });
      const pending = await Application.countDocuments({ status: "pending" });

      res.json({
        success: true,
        data: {
          ...stats,
          applications: {
            total: applications,
            accepted,
            shortlisted,
            rejected,
            pending,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/votes/admin/projects/create
   * Admin creates and uploads a new project for voting
   * Body: { type, fullName, teamName, idea, focusAreas, email, status }
   */
  async createProject(req, res, next) {
    try {
      const {
        type,
        fullName,
        teamName,
        idea,
        focusAreas,
        email,
        phone,
        participantType,
        experience,
        motivation,
        age,
        city,
        country,
        leadName,
        leadEmail,
        leadPhone,
        teamSize,
        teamMembers,
        sex,
        education,
      } = req.body;

      // Validation
      if (!type || !idea || !focusAreas || focusAreas.length === 0 || !email) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      if (type === "individual" && !fullName) {
        return res.status(400).json({
          success: false,
          message: "fullName is required for individual projects",
        });
      }

      if (type === "team" && !teamName) {
        return res.status(400).json({
          success: false,
          message: "teamName is required for team projects",
        });
      }

      const Project = require("../models/Project");

      // Valid enum values
      const validParticipantTypes = ["hardtech", "software", "commercial", "catalyst"];

      const newProject = new Project({
        type,
        fullName: type === "individual" ? fullName : undefined,
        teamName: type === "team" ? teamName : undefined,
        idea,
        focusAreas,
        email,
        phone: phone || "",
        // Only set participantType if it's a valid enum value (for individuals)
        participantType:
          type === "individual" && participantType && validParticipantTypes.includes(participantType)
            ? participantType
            : type === "individual"
            ? "software" // Default for individuals
            : "software", // Default for teams too
        experience: experience || "",
        motivation: motivation || "",
        age: age || 0,
        city: city || "",
        country: country || "",
        leadName: type === "team" ? leadName || "" : undefined,
        leadEmail: type === "team" ? leadEmail || email : undefined,
        leadPhone: type === "team" ? leadPhone || phone || "" : undefined,
        teamSize: type === "team" ? teamSize || 0 : undefined,
        teamMembers: type === "team" && teamMembers && teamMembers.length > 0 ? teamMembers : type === "team" ? [] : undefined,
        publishedAt: new Date(),
      });

      const savedProject = await newProject.save();

      res.status(201).json({
        success: true,
        message: "Project published successfully for voting",
        data: savedProject,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VotingController;
