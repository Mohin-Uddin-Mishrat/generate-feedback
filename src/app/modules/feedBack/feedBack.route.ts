import { Router } from "express";
import { feedback_controllers } from "./feedBack.controller";
import RequestValidator from "../../middlewares/request_validator";
import { feedback_validation } from "./feedBack.validation";

const feedbackRoute = Router();

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     tags:
 *       - Feedback
 *     summary: Submit feedback
 *     description: Submits user feedback. Google Gemini AI automatically analyses the content and assigns category, priority, sentiment, and team.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeedbackPayload'
 *     responses:
 *       201:
 *         description: Feedback created and analysed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Validation error (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
feedbackRoute.post(
    "/",
    RequestValidator(feedback_validation.create_feedback_validation),
    feedback_controllers.create_feedback
);

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     tags:
 *       - Feedback
 *     summary: Get all feedbacks
 *     description: Returns a list of all feedbacks. Supports filtering and full-text search via query params.
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search across name, email, and content fields
 *         schema:
 *           type: string
 *       - name: category
 *         in: query
 *         description: Filter by AI-assigned category (e.g. Bug, Feature Request)
 *         schema:
 *           type: string
 *       - name: priority
 *         in: query
 *         description: Filter by priority level
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *       - name: sentiment
 *         in: query
 *         description: Filter by sentiment
 *         schema:
 *           type: string
 *           enum: [Positive, Neutral, Negative]
 *       - name: team
 *         in: query
 *         description: Filter by AI-assigned team (e.g. Engineering, Design)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of feedbacks returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Feedback'
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 */
feedbackRoute.get("/", feedback_controllers.get_all_feedbacks);

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     tags:
 *       - Feedback
 *     summary: Get a single feedback by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the feedback
 *         schema:
 *           type: string
 *           example: 663a1f2e4b3c2a1d0e5f6789
 *     responses:
 *       200:
 *         description: Feedback found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
feedbackRoute.get("/:id", feedback_controllers.get_feedback_by_id);

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     tags:
 *       - Feedback
 *     summary: Delete a feedback by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the feedback to delete
 *         schema:
 *           type: string
 *           example: 663a1f2e4b3c2a1d0e5f6789
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
feedbackRoute.delete(
    "/:id",
    feedback_controllers.delete_feedback
);

export default feedbackRoute;
