const express = require("express")
const router = express.Router()
const applicationController = require("../controllers/application.controller")

/**
 * @swagger
 * /api/applications/individual:
 *   post:
 *     summary: Submit an individual application
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
 *         description: Duplicate application
 */
router.post("/individual", applicationController.createIndividual.bind(applicationController))

/**
 * @swagger
 * /api/applications/team:
 *   post:
 *     summary: Submit a team application
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
router.post("/team", applicationController.createTeam.bind(applicationController))

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications with optional filters
 *     tags: [Applications]
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
 *         description: List of applications
 */
router.get("/", applicationController.getAll.bind(applicationController))

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get a single application by ID
 *     tags: [Applications]
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
router.get("/:id", applicationController.getById.bind(applicationController))

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
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
router.patch("/:id/status", applicationController.updateStatus.bind(applicationController))

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
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
router.delete("/:id", applicationController.delete.bind(applicationController))

module.exports = router
