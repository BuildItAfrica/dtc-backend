


// // routes/applications.js
// const express = require("express");
// const router = express.Router();
// const applicationController = require("../controllers/application.controller");
// const { protect } = require("../middleware/auth");

// /**
//  * @swagger
//  * tags:
//  *   name: Applications
//  *   description: Submit and manage DTC 2026 applications
//  */

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Questionnaire:
//  *       type: object
//  *       properties:
//  *         motivationDraw:
//  *           type: string
//  *           description: Motivation and personal connection to sector (~100 words)
//  *         specificProblem:
//  *           type: string
//  *         pressingIssue:
//  *           type: string
//  *         proposedIdea:
//  *           type: string
//  *         userNeedsAddressed:
//  *           type: string
//  *         profileDescription:
//  *           type: string
//  *           description: Which profile (hardtech/software/commercial/catalyst) and past experience (~250 words)
//  *         tangibleOutcome:
//  *           type: string
//  *         dtExperience:
//  *           type: string
//  *         dtLessonLearned:
//  *           type: string
//  *         collaborationStyle:
//  *           type: string
//  *         teamContribution:
//  *           type: string
//  *         longTermImpact:
//  *           type: string
//  *         careerAlignmentAndPerspective:
//  *           type: string
//  *         availability:
//  *           type: string
//  *         risksAndMomentum:
//  *           type: string
//  *
//  *     IndividualApplication:
//  *       type: object
//  *       required:
//  *         - fullName
//  *         - email
//  *         - participantType
//  *         - focusAreas
//  *       properties:
//  *         fullName:
//  *           type: string
//  *         email:
//  *           type: string
//  *           format: email
//  *         phone:
//  *           type: string
//  *         country:
//  *           type: string
//  *         participantType:
//  *           type: string
//  *           enum: [hardtech, software, commercial, catalyst]
//  *         focusAreas:
//  *           type: array
//  *           items:
//  *             type: string
//  *             enum: [healthcare, energy, agriculture]
//  *         experience:
//  *           type: string
//  *         motivation:
//  *           type: string
//  *         idea:
//  *           type: string
//  *         questionnaire:
//  *           $ref: '#/components/schemas/Questionnaire'
//  *           description: Required during DTC 2026 application period (Nov-Dec 2025)
//  *
//  *     TeamApplication:
//  *       type: object
//  *       required:
//  *         - teamName
//  *         - leadEmail
//  *         - focusAreas
//  *       properties:
//  *         teamName:
//  *           type: string
//  *         teamSize:
//  *           type: integer
//  *         teamMembers:
//  *           type: array
//  *           items:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *         leadName:
//  *           type: string
//  *         leadEmail:
//  *           type: string
//  *           format: email
//  *         focusAreas:
//  *           type: array
//  *           items:
//  *             type: string
//  *             enum: [healthcare, energy, agriculture]
//  *         experience:
//  *           type: string
//  *         motivation:
//  *           type: string
//  *         idea:
//  *           type: string
//  *         questionnaire:
//  *           $ref: '#/components/schemas/Questionnaire'
//  *           description: Required during DTC 2026 application period (Nov-Dec 2025)
//  *
//  *     StatusUpdate:
//  *       type: object
//  *       required:
//  *         - status
//  *       properties:
//  *         status:
//  *           type: string
//  *           enum: [pending, reviewing, shortlisted, accepted, rejected]
//  *         notes:
//  *           type: string
//  *
//  *     AIScalabilityResponse:
//  *       type: object
//  *       properties:
//  *         scalabilityScore:
//  *           type: integer
//  *           minimum: 0
//  *           maximum: 100
//  *           description: AI-generated scalability score (0-100)
//  *         summary:
//  *           type: string
//  *           description: One-sentence verdict
//  *         strengths:
//  *           type: array
//  *           items:
//  *             type: string
//  *           description: Key strengths identified
//  *         risks:
//  *           type: array
//  *           items:
//  *             type: string
//  *           description: Key risks identified
//  *         recommendation:
//  *           type: string
//  *           description: Actionable advice from AI
//  *
//  *     Pagination:
//  *       type: object
//  *       properties:
//  *         page:
//  *           type: integer
//  *         limit:
//  *           type: integer
//  *         total:
//  *           type: integer
//  *         pages:
//  *           type: integer
//  */

// /**
//  * @swagger
//  * /api/applications/individual:
//  *   post:
//  *     summary: Submit an individual application for DTC 2026
//  *     tags: [Applications]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/IndividualApplication'
//  *     responses:
//  *       201:
//  *         description: Application submitted successfully
//  *       400:
//  *         description: Missing required fields or incomplete questionnaire
//  *       409:
//  *         description: An individual application with this email already exists
//  */
// router.post("/individual", applicationController.createIndividual.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications/team:
//  *   post:
//  *     summary: Submit a team application for DTC 2026
//  *     tags: [Applications]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/TeamApplication'
//  *     responses:
//  *       201:
//  *         description: Team application submitted successfully
//  *       400:
//  *         description: Missing required fields or incomplete questionnaire
//  *       409:
//  *         description: Team name or lead email already exists
//  */
// router.post("/team", applicationController.createTeam.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications:
//  *   get:
//  *     summary: Get all applications (Admin only)
//  *     tags: [Applications]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: type
//  *         schema:
//  *           type: string
//  *           enum: [individual, team]
//  *       - in: query
//  *         name: status
//  *         schema:
//  *           type: string
//  *           enum: [pending, reviewing, shortlisted, accepted, rejected]
//  *       - in: query
//  *         name: focusArea
//  *         schema:
//  *           type: string
//  *           enum: [healthcare, energy, agriculture]
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 20
//  *     responses:
//  *       200:
//  *         description: Paginated list of applications
//  */
// router.get("/", protect, applicationController.getAll.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications/{id}:
//  *   get:
//  *     summary: Get a single application by ID (Admin only)
//  *     tags: [Applications]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Application details
//  *       404:
//  *         description: Application not found
//  */
// router.get("/:id", protect, applicationController.getById.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications/{id}/status:
//  *   patch:
//  *     summary: Update application status (Admin only)
//  *     tags: [Applications]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/StatusUpdate'
//  *     responses:
//  *       200:
//  *         description: Status updated successfully
//  *       400:
//  *         description: Invalid status
//  *       404:
//  *         description: Application not found
//  */
// router.patch("/:id/status", protect, applicationController.updateStatus.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications/{id}:
//  *   delete:
//  *     summary: Delete an application (Admin only)
//  *     tags: [Applications]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Application deleted successfully
//  *       404:
//  *         description: Application not found
//  */
// router.delete("/:id", protect, applicationController.delete.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications/{id}/ai-score:
//  *   post:
//  *     summary: Generate AI Scalability Score for an application (Admin only)
//  *     description: Uses Groq AI (free) to analyze the application's long-term (5+ year) scalability potential based on experience, motivation, and idea.
//  *     tags: [Applications]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: Application ID
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: AI analysis successful
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 analysis:
//  *                   $ref: '#/components/schemas/AIScalabilityResponse'
//  *       404:
//  *         description: Application not found
//  *       500:
//  *         description: AI analysis failed (temporary service issue)
//  */
// router.post("/:id/ai-score", protect, applicationController.analyzeScalability.bind(applicationController));

// module.exports = router;





















// routes/applications.js

const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { protect } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Submit and manage DTC 2026 applications
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Questionnaire:
 *       type: object
 *       properties:
 *         motivationDraw:
 *           type: string
 *           description: Motivation and personal connection to sector (~100 words)
 *         specificProblem:
 *           type: string
 *         pressingIssue:
 *           type: string
 *         proposedIdea:
 *           type: string
 *         userNeedsAddressed:
 *           type: string
 *         profileDescription:
 *           type: string
 *           description: Which profile (hardtech/software/commercial/catalyst) and past experience (~250 words)
 *         tangibleOutcome:
 *           type: string
 *         dtExperience:
 *           type: string
 *         dtLessonLearned:
 *           type: string
 *         collaborationStyle:
 *           type: string
 *         teamContribution:
 *           type: string
 *         longTermImpact:
 *           type: string
 *         careerAlignmentAndPerspective:
 *           type: string
 *         availability:
 *           type: string
 *         risksAndMomentum:
 *           type: string
 *
 *     IndividualApplication:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - participantType
 *         - focusAreas
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         country:
 *           type: string
 *         participantType:
 *           type: string
 *           enum: [hardtech, software, commercial, catalyst]
 *         focusAreas:
 *           type: array
 *           items:
 *             type: string
 *             enum: [healthcare, energy, agriculture]
 *         experience:
 *           type: string
 *         motivation:
 *           type: string
 *         idea:
 *           type: string
 *         questionnaire:
 *           $ref: '#/components/schemas/Questionnaire'
 *
 *     TeamApplication:
 *       type: object
 *       required:
 *         - teamName
 *         - leadEmail
 *         - focusAreas
 *       properties:
 *         teamName:
 *           type: string
 *         teamSize:
 *           type: integer
 *         teamMembers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *         leadName:
 *           type: string
 *         leadEmail:
 *           type: string
 *           format: email
 *         focusAreas:
 *           type: array
 *           items:
 *             type: string
 *             enum: [healthcare, energy, agriculture]
 *         experience:
 *           type: string
 *         motivation:
 *           type: string
 *         idea:
 *           type: string
 *         questionnaire:
 *           $ref: '#/components/schemas/Questionnaire'
 *
 *     StatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, accepted, rejected]
 *         notes:
 *           type: string
 *
 *     BulkEmailRequest:
 *       type: object
 *       required:
 *         - applicationIds
 *         - subject
 *         - message
 *       properties:
 *         applicationIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of application _id values
 *         subject:
 *           type: string
 *           description: Email subject line
 *         message:
 *           type: string
 *           description: Full HTML email body. Supports {{name}} and {{teamName}} placeholders for personalization
 *
 *     BulkEmailResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of applications processed
 *         success:
 *           type: integer
 *           description: Number of emails sent successfully
 *         failed:
 *           type: integer
 *           description: Number of emails that failed
 *         errors:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /api/applications/individual:
 *   post:
 *     summary: Submit an individual application for DTC 2026
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IndividualApplication'
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Duplicate email
 */
router.post("/individual", applicationController.createIndividual.bind(applicationController));

/**
 * @swagger
 * /api/applications/team:
 *   post:
 *     summary: Submit a team application for DTC 2026
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamApplication'
 *     responses:
 *       201:
 *         description: Team application submitted successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Duplicate team name or lead email
 */
router.post("/team", applicationController.createTeam.bind(applicationController));

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [individual, team]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, accepted, rejected]
 *       - in: query
 *         name: focusArea
 *         schema:
 *           type: string
 *           enum: [healthcare, energy, agriculture]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of applications
 */
router.get("/", protect, applicationController.getAll.bind(applicationController));

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get a single application by ID (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application details
 *       404:
 *         description: Application not found
 */
router.get("/:id", protect, applicationController.getById.bind(applicationController));

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Application not found
 */
router.patch("/:id/status", protect, applicationController.updateStatus.bind(applicationController));

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 */
router.delete("/:id", protect, applicationController.delete.bind(applicationController));

/**
 * @swagger
 * /api/applications/bulk-email:
 *   post:
 *     summary: Send custom bulk email to selected applicants (no status change)
 *     description: |
 *       Sends a fully customizable email to multiple applicants at once.
 *       The message supports personalization:
 *       - {{name}} → Applicant's full name (or lead name for teams)
 *       - {{teamName}} → Team name (empty for individuals)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkEmailRequest'
 *     responses:
 *       200:
 *         description: Bulk email process completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BulkEmailResponse'
 *       400:
 *         description: Invalid request (missing fields)
 *       404:
 *         description: No valid applications found
 *       500:
 *         description: Server error during sending
 */
router.post("/bulk-email", protect, applicationController.sendBulkCustomEmail.bind(applicationController));





module.exports = router;