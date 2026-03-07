"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Generate Feedback API",
            version: "1.0.0",
            description: "REST API with AI-powered feedback analysis using Google Gemini",
        },
        servers: [{ url: "http://localhost:5000", description: "Local Dev Server" }],
        components: {
            schemas: {
                CreateFeedbackPayload: {
                    type: "object",
                    required: ["name", "email", "content"],
                    properties: {
                        name: { type: "string", example: "Alice" },
                        email: { type: "string", example: "alice@example.com" },
                        content: { type: "string", example: "The dark mode feature is amazing!" },
                    },
                },
                FeedbackAnalysis: {
                    type: "object",
                    properties: {
                        category: { type: "string", example: "UI/UX" },
                        priority: { type: "string", enum: ["Low", "Medium", "High", "Critical"], example: "Medium" },
                        sentiment: { type: "string", enum: ["Positive", "Neutral", "Negative"], example: "Positive" },
                        team: { type: "string", example: "Design" },
                    },
                },
                Feedback: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "663a1f2e4b3c2a1d0e5f6789" },
                        name: { type: "string", example: "Alice" },
                        email: { type: "string", example: "alice@example.com" },
                        content: { type: "string", example: "The dark mode feature is amazing!" },
                        analysis: { $ref: "#/components/schemas/FeedbackAnalysis" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string" },
                        data: { type: "object" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string" },
                    },
                },
            },
        },
    },
    // Only scan your actual route files to generate the UI
    apis: [
        path_1.default.join(__dirname, "../../routes.{ts,js}"),
        path_1.default.join(__dirname, "../modules/**/*.route.{ts,js}"),
    ],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
