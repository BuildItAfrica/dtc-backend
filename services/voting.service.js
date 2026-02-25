// services/voting.service.js
const Vote = require("../models/Vote");
const Project = require("../models/Project");
const { VOTING_WEIGHTS } = require("../config/votingWeights");

class VotingService {
  /**
   * Submit a vote for a project
   * @param {string} projectId - Project ID to vote for
   * @param {string} voterEmail - Email of the voter
   * @returns {Promise<Object>} Vote record
   */
  async submitVote(projectId, voterEmail) {
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if voter has already voted (one vote per email total)
    const existingVote = await Vote.findOne({ voterEmail });
    if (existingVote) {
      const error = new Error("You have already voted. Each email can vote once only.");
      error.code = "ALREADY_VOTED";
      throw error;
    }

    // Create new vote
    const vote = new Vote({
      applicationId: projectId,
      voterEmail: voterEmail.toLowerCase().trim(),
    });

    return await vote.save();
  }

  /**
   * Get vote count for an application
   * @param {string} applicationId - Application ID
   * @returns {Promise<number>} Vote count
   */
  async getVoteCount(applicationId) {
    const count = await Vote.countDocuments({ applicationId });
    return count;
  }

  /**
   * Get all vote counts for all applications
   * @returns {Promise<Array>} Array of {applicationId, voteCount}
   */
  async getAllVoteCounts() {
    const voteCounts = await Vote.aggregate([
      {
        $group: {
          _id: "$applicationId",
          voteCount: { $sum: 1 },
        },
      },
    ]);
    return voteCounts;
  }

  /**
   * Check if a voter has already voted (one vote per email total)
   * @param {string} voterEmail - Email of the voter
   * @returns {Promise<boolean>} True if voter has voted
   */
  async hasVoted(voterEmail) {
    const vote = await Vote.findOne({ voterEmail });
    return !!vote;
  }

  /**
   * Get voter's votes
   * @param {string} voterEmail - Email of the voter
   * @returns {Promise<Array>} Array of voted application IDs
   */
  async getVoterVotes(voterEmail) {
    const votes = await Vote.find({ voterEmail }, "applicationId");
    return votes.map((v) => v.applicationId.toString());
  }

  /**
   * Calculate final score for an application
   * Score formula: (projectScore * 0.5) + (teamScore * 0.2) + (judgeScore * 0.2) + (publicVoting * 0.1)
   * 
   * @param {string} applicationId - Application ID
   * @param {Object} scores - {projectScore, teamScore, judgeScore} (0-100 scale)
   * @returns {Promise<number>} Final weighted score
   */
  calculateFinalScore(applicationId, { projectScore, teamScore, judgeScore }, applicationScore) {
    // Ensure scores are in 0-100 range
    const clampScore = (score) => Math.max(0, Math.min(100, score || 0));
    
    const project = clampScore(projectScore);
    const team = clampScore(teamScore);
    const judges = clampScore(judgeScore);
    
    // Get public vote percentage (votes / expected max votes)
    // For now, just use the vote count as is
    const publicVotes = applicationScore?.publicVoteCount || 0;
    
    const finalScore =
      project * VOTING_WEIGHTS.project +
      team * VOTING_WEIGHTS.team +
      judges * VOTING_WEIGHTS.judges +
      publicVotes * VOTING_WEIGHTS.publicVoting;

    return finalScore;
  }

  /**
   * Get comprehensive voting results
   * @returns {Promise<Array>} Array of applications with vote counts and rankings
   */
  async getVotingResults() {
    try {
      const projects = await Project.find({});

      const voteCounts = await this.getAllVoteCounts();
      const voteCountMap = {};
      
      voteCounts.forEach((vc) => {
        voteCountMap[vc._id.toString()] = vc.voteCount;
      });

      const results = projects.map((project) => ({
        _id: project._id,
        type: project.type,
        fullName: project.fullName,
        teamName: project.teamName,
        leadName: project.leadName,
        leadEmail: project.leadEmail,
        leadPhone: project.leadPhone,
        teamSize: project.teamSize,
        teamMembers: project.teamMembers,
        email: project.email,
        phone: project.phone,
        participantType: project.participantType,
        experience: project.experience,
        motivation: project.motivation,
        age: project.age,
        city: project.city,
        country: project.country,
        idea: project.idea,
        focusAreas: project.focusAreas,
        voteCount: voteCountMap[project._id.toString()] || 0,
      }));

      // Sort by vote count descending
      results.sort((a, b) => b.voteCount - a.voteCount);

      return results;
    } catch (error) {
      console.error("Error in getVotingResults:", error);
      throw error;
    }
  }

  /**
   * Clear all votes (admin only)
   * @returns {Promise<Object>} Delete result
   */
  async clearAllVotes() {
    const result = await Vote.deleteMany({});
    return result;
  }

  /**
   * Get voting statistics
   * @returns {Promise<Object>} Voting stats
   */
  async getVotingStats() {
    const totalVotes = await Vote.countDocuments();
    const uniqueVoters = await Vote.collection.distinct("voterEmail");
    const publishedProjects = await Project.countDocuments();

    return {
      totalVotes,
      uniqueVoters: uniqueVoters.length,
      publishedProjects,
      avgVotesPerProject: publishedProjects > 0 ? totalVotes / publishedProjects : 0,
    };
  }
}

module.exports = VotingService;
