import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";
import { TCreateFeedbackPayload, TFeedbackAnalysis, TFeedbackQuery } from "./feedBack.interface";
import FeedbackModel, { FeedbackAnalysisSchema } from "./feedBack.schema";

const analyzeWithGemini = async (content: string): Promise<TFeedbackAnalysis> => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = "gemini-flash-latest";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
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

        const data: any = await response.json();

        if (response.status === 429) {
            throw new Error(`Quota Exceeded: ${data.error?.message || "Wait a minute."}`);
        }

        if (data.error) {
            throw new Error(`Google API: ${data.error.message}`);
        }

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("GEMINI_BLOCKED: No response candidates returned.");
        }

        const raw = data.candidates[0].content?.parts?.[0]?.text || "";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return FeedbackAnalysisSchema.parse(parsed);

    } catch (error: any) {
        throw error;
    }
};







const create_feedback_into_db = async (payload: TCreateFeedbackPayload) => {
    const { name, email, content } = payload;

    // Call AI analysis (errors here will now be thrown to the client)
    const analysisResult = await analyzeWithGemini(content);

    const newFeedback = new FeedbackModel({
        name,
        email,
        content,
        analysis: analysisResult
    });

    await newFeedback.save();

    console.log(`🚀 Feedback Processed: ${newFeedback._id} | Sentiment: ${analysisResult.sentiment}`);

    return newFeedback;
};

const get_all_feedbacks_from_db = async (queryParams: TFeedbackQuery) => {
    const { search } = queryParams;

    const filter: Record<string, any> = {};

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ];
    }

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
