import { GoogleGenAI } from "@google/genai";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";
import { TCreateFeedbackPayload, TFeedbackAnalysis, TFeedbackQuery } from "./feedBack.interface";
import FeedbackModel, { FeedbackAnalysisSchema } from "./feedBack.schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DEFAULT_ANALYSIS: TFeedbackAnalysis = {
    category: "Uncategorized",
    priority: "Medium",
    sentiment: "Neutral",
    team: "General Support",
};

const analyzeWithGemini = async (content: string): Promise<TFeedbackAnalysis> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
Analyze the following user feedback and extract the category, priority, sentiment, and assigned team.
Return ONLY valid JSON matching this schema (no markdown, no extra text):
{
  "category": "string",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "team": "string"
}

User Feedback:
"${content}"
        `.trim(),
    });

    const raw = response.text ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return FeedbackAnalysisSchema.parse(parsed);
};

const create_feedback_into_db = async (payload: TCreateFeedbackPayload) => {
    const { name, email, content } = payload;

    let analysisResult: TFeedbackAnalysis;
    try {
        analysisResult = await analyzeWithGemini(content);
    } catch (llmError) {
        console.error("LLM/Parsing Error — using fallback:", llmError);
        analysisResult = DEFAULT_ANALYSIS;
    }

    const newFeedback = new FeedbackModel({ name, email, content, analysis: analysisResult });
    await newFeedback.save();

    console.log(`[SIMULATED EMAIL] Notifying ${analysisResult.team} team about feedback ${newFeedback._id}`);

    return newFeedback;
};

const get_all_feedbacks_from_db = async (queryParams: TFeedbackQuery) => {
    const { search, category, priority, sentiment, team } = queryParams;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ];
    }
    if (category) filter["analysis.category"] = { $regex: category, $options: "i" };
    if (priority) filter["analysis.priority"] = priority;
    if (sentiment) filter["analysis.sentiment"] = sentiment;
    if (team) filter["analysis.team"] = { $regex: team, $options: "i" };

    const feedbacks = await FeedbackModel.find(filter).sort({ createdAt: -1 });
    const total = await FeedbackModel.countDocuments(filter);

    return { feedbacks, total };
};

const get_feedback_by_id_from_db = async (id: string) => {
    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
        throw new AppError("Feedback not found!", httpStatus.NOT_FOUND);
    }
    return feedback;
};

const delete_feedback_from_db = async (id: string) => {
    const feedback = await FeedbackModel.findByIdAndDelete(id);
    if (!feedback) {
        throw new AppError("Feedback not found!", httpStatus.NOT_FOUND);
    }
    return feedback;
};

export const feedback_services = {
    create_feedback_into_db,
    get_all_feedbacks_from_db,
    get_feedback_by_id_from_db,
    delete_feedback_from_db,
};
