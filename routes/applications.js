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
//  * /api/applications/individual:
//  *   post:
//  *     summary: Submit an individual application
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
//  *         description: Missing required fields
//  *       409:
//  *         description: Email already used
//  */
// router.post("/individual", applicationController.createIndividual.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications/team:
//  *   post:
//  *     summary: Submit a team application
//  *     tags: [Applications]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/TeamApplication'
//  *     responses:
//  *       201:
//  *         description: Team application submitted
//  *       400:
//  *         description: Missing required fields
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
//  *         description: List of applications
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 applications:
//  *                   type: array
//  *                   items:
//  *                     oneOf:
//  *                       - $ref: '#/components/schemas/IndividualApplication'
//  *                       - $ref: '#/components/schemas/TeamApplication'
//  *                 pagination:
//  *                   $ref: '#/components/schemas/Pagination'
//  */
// router.get("/", protect, applicationController.getAll.bind(applicationController));

// /**
//  * @swagger
//  * /api/applications/{id}:
//  *   get:
//  *     summary: Get application by ID (Admin only)
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
//  *         description: Not found
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
//  *         description: Status updated
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
//  *     summary: Delete application (Admin only)
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
//  *         description: Application deleted
//  *       404:
//  *         description: Not found
//  */
// router.delete("/:id", protect, applicationController.delete.bind(applicationController));

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
 *           description: Required during DTC 2026 application period (Nov-Dec 2025)
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
 *           description: Required during DTC 2026 application period (Nov-Dec 2025)
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
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         pages:
 *           type: integer
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
 *         description: Missing required fields or incomplete questionnaire
 *       409:
 *         description: An individual application with this email already exists
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
 *         description: Missing required fields or incomplete questionnaire
 *       409:
 *         description: Team name or lead email already exists
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

module.exports = router;