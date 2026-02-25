// routes/voting.routes.js
const express = require("express");
const router = express.Router();
const VotingController = require("../controllers/voting.controller");
const { protect } = require("../middleware/auth");

const votingController = new VotingController();

/**
 * @swagger
 * tags:
 *   name: Voting
 *   description: Public voting system for accepted applications
 */

/**
 * @swagger
 * /api/votes/candidates:
 *   get:
 *     summary: Get all candidates available for voting
 *     tags: [Voting]
 *     responses:
 *       200:
 *         description: List of candidates with vote counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       idea:
 *                         type: string
 *                       focusAreas:
 *                         type: array
 *                       voteCount:
 *                         type: number
 */
router.get("/candidates", (req, res, next) => votingController.getCandidates(req, res, next));

/**
 * @swagger
 * /api/votes/submit:
 *   post:
 *     summary: Submit a vote for an application
 *     tags: [Voting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - voterEmail
 *             properties:
 *               applicationId:
 *                 type: string
 *               voterEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Vote submitted successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Already voted for this application
 */
router.post("/submit", (req, res, next) => votingController.submitVote(req, res, next));

/**
 * @swagger
 * /api/votes/candidate/{applicationId}:
 *   get:
 *     summary: Get vote count for a specific application
 *     tags: [Voting]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vote count for the application
 */
router.get("/candidate/:applicationId", (req, res, next) =>
  votingController.getCandidateVotes(req, res, next)
);

/**
 * @swagger
 * /api/votes/check-voted:
 *   get:
 *     summary: Check if a voter has voted for an application
 *     tags: [Voting]
 *     parameters:
 *       - in: query
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: voterEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Whether the voter has voted
 */
router.get("/check-voted", (req, res, next) => votingController.checkUserVoted(req, res, next));

/**
 * @swagger
 * /api/votes/my-votes:
 *   get:
 *     summary: Get all applications a voter has voted for
 *     tags: [Voting]
 *     parameters:
 *       - in: query
 *         name: voterEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: List of voted application IDs
 */
router.get("/my-votes", (req, res, next) => votingController.getMyVotes(req, res, next));

/**
 * @swagger
 * /api/votes/results:
 *   get:
 *     summary: Get all voting results ranked by vote count
 *     tags: [Voting]
 *     responses:
 *       200:
 *         description: Ranked voting results
 */
router.get("/results", (req, res, next) => votingController.getResults(req, res, next));

/**
 * @swagger
 * /api/votes/stats:
 *   get:
 *     summary: Get voting statistics
 *     tags: [Voting]
 *     responses:
 *       200:
 *         description: Voting statistics
 */
router.get("/stats", (req, res, next) => votingController.getStats(req, res, next));

/**
 * @swagger
 * /api/votes/clear:
 *   delete:
 *     summary: Clear all votes (Admin only)
 *     tags: [Voting]
 *     responses:
 *       200:
 *         description: All votes cleared
 */
router.delete("/clear", (req, res, next) => votingController.clearVotes(req, res, next));

/**
 * @swagger
 * /api/votes/admin/projects:
 *   get:
 *     summary: Admin - Get all applications for voting management
 *     tags: [Voting Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, accepted, rejected]
 *       - in: query
 *         name: focusArea
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of all applications
 *       401:
 *         description: Unauthorized
 */
router.get("/admin/projects", protect, (req, res, next) =>
  votingController.adminGetAllProjects(req, res, next)
);

/**
 * @swagger
 * /api/votes/admin/voting-projects:
 *   get:
 *     summary: Admin - Get all accepted projects in voting
 *     tags: [Voting Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of projects in voting
 *       401:
 *         description: Unauthorized
 */
router.get("/admin/voting-projects", protect, (req, res, next) =>
  votingController.adminGetVotingProjects(req, res, next)
);

/**
 * @swagger
 * /api/votes/admin/projects/{applicationId}/accept:
 *   patch:
 *     summary: Admin - Accept application for voting
 *     tags: [Voting Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application accepted
 *       401:
 *         description: Unauthorized
 */
router.patch("/admin/projects/:applicationId/accept", protect, (req, res, next) =>
  votingController.adminAcceptProject(req, res, next)
);

/**
 * @swagger
 * /api/votes/admin/projects/{applicationId}/reject:
 *   patch:
 *     summary: Admin - Reject application
 *     tags: [Voting Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application rejected
 *       401:
 *         description: Unauthorized
 */
router.patch("/admin/projects/:applicationId/reject", protect, (req, res, next) =>
  votingController.adminRejectProject(req, res, next)
);

/**
 * @swagger
 * /api/votes/admin/projects/{applicationId}/shortlist:
 *   patch:
 *     summary: Admin - Shortlist application
 *     tags: [Voting Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application shortlisted
 *       401:
 *         description: Unauthorized
 */
router.patch("/admin/projects/:applicationId/shortlist", protect, (req, res, next) =>
  votingController.adminShortlistProject(req, res, next)
);

/**
 * @swagger
 * /api/votes/admin/stats:
 *   get:
 *     summary: Admin - Get detailed voting statistics
 *     tags: [Voting Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detailed voting and application statistics
 *       401:
 *         description: Unauthorized
 */
router.get("/admin/stats", protect, (req, res, next) =>
  votingController.adminGetDetailedStats(req, res, next)
);

/**
 * @swagger
 * /api/votes/admin/projects/create:
 *   post:
 *     summary: Admin - Create and upload a new project for voting
 *     tags: [Voting Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - idea
 *               - focusAreas
 *               - email
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [individual, team]
 *               fullName:
 *                 type: string
 *               teamName:
 *                 type: string
 *               idea:
 *                 type: string
 *               focusAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *                 default: accepted
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/admin/projects/create", protect, (req, res, next) =>
  votingController.createProject(req, res, next)
);

module.exports = router;
