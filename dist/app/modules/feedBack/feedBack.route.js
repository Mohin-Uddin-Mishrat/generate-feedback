"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedBack_controller_1 = require("./feedBack.controller");
const request_validator_1 = __importDefault(require("../../middlewares/request_validator"));
const feedBack_validation_1 = require("./feedBack.validation");
const feedbackRoute = (0, express_1.Router)();
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
feedbackRoute.post("/", (0, request_validator_1.default)(feedBack_validation_1.feedback_validation.create_feedback_validation), feedBack_controller_1.feedback_controllers.create_feedback);
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
feedbackRoute.get("/", feedBack_controller_1.feedback_controllers.get_all_feedbacks);
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
feedbackRoute.get("/:id", feedBack_controller_1.feedback_controllers.get_feedback_by_id);
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
feedbackRoute.delete("/:id", feedBack_controller_1.feedback_controllers.delete_feedback);
exports.default = feedbackRoute;
