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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedback_services = void 0;
const app_error_1 = require("../../utils/app_error");
const http_status_1 = __importDefault(require("http-status"));
const feedBack_schema_1 = __importStar(require("./feedBack.schema"));
const analyzeWithGemini = (content) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = "gemini-flash-latest";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = yield fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                        parts: [{
                                text: `
Analyze the following user feedback and extract the category, priority, sentiment, and assigned team.
Return ONLY valid JSON (no markdown, no extra text):
{
  "category": "string",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "team": "string"
}

User Feedback:
"${content}"
                        `.trim()
                            }]
                    }]
            })
        });
        const data = yield response.json();
        if (response.status === 429) {
            throw new Error(`Quota Exceeded: ${((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || "Wait a minute."}`);
        }
        if (data.error) {
            throw new Error(`Google API: ${data.error.message}`);
        }
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("GEMINI_BLOCKED: No response candidates returned.");
        }
        const raw = ((_d = (_c = (_b = data.candidates[0].content) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) || "";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return feedBack_schema_1.FeedbackAnalysisSchema.parse(parsed);
    }
    catch (error) {
        throw error;
    }
});
const create_feedback_into_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, content } = payload;
    // Call AI analysis (errors here will now be thrown to the client)
    const analysisResult = yield analyzeWithGemini(content);
    const newFeedback = new feedBack_schema_1.default({
        name,
        email,
        content,
        analysis: analysisResult
    });
    yield newFeedback.save();
    console.log(`🚀 Feedback Processed: ${newFeedback._id} | Sentiment: ${analysisResult.sentiment}`);
    return newFeedback;
});
const get_all_feedbacks_from_db = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = queryParams;
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ];
    }
    const feedbacks = yield feedBack_schema_1.default.find(filter).sort({ createdAt: -1 });
    const total = yield feedBack_schema_1.default.countDocuments(filter);
    return { feedbacks, total };
});
const get_feedback_by_id_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = yield feedBack_schema_1.default.findById(id);
    if (!feedback) {
        throw new app_error_1.AppError("Feedback not found!", http_status_1.default.NOT_FOUND);
    }
    return feedback;
});
const delete_feedback_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = yield feedBack_schema_1.default.findByIdAndDelete(id);
    if (!feedback) {
        throw new app_error_1.AppError("Feedback not found!", http_status_1.default.NOT_FOUND);
    }
    return feedback;
});
exports.feedback_services = {
    create_feedback_into_db,
    get_all_feedbacks_from_db,
    get_feedback_by_id_from_db,
    delete_feedback_from_db,
};
