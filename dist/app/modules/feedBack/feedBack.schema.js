"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackAnalysisSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
// Zod schema for LLM output validation
exports.FeedbackAnalysisSchema = zod_1.z.object({
    category: zod_1.z.string().describe("The category of the feedback (e.g., Bug, Feature Request, UI/UX, Performance)"),
    priority: zod_1.z.enum(["Low", "Medium", "High", "Critical"]).describe("Priority level based on urgency"),
    sentiment: zod_1.z.enum(["Positive", "Neutral", "Negative"]).describe("Emotional tone of the user"),
    team: zod_1.z.string().describe("The specific team responsible (e.g., Engineering, Design, Support, Sales)")
});
const FeedbackSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    analysis: {
        category: String,
        priority: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
        sentiment: { type: String, enum: ["Positive", "Neutral", "Negative"] },
        team: String
    },
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('Feedback', FeedbackSchema);
