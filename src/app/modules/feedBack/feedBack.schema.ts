import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for LLM output validation
export const FeedbackAnalysisSchema = z.object({
  category: z.string().describe("The category of the feedback (e.g., Bug, Feature Request, UI/UX, Performance)"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).describe("Priority level based on urgency"),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]).describe("Emotional tone of the user"),
  team: z.string().describe("The specific team responsible (e.g., Engineering, Design, Support, Sales)")
});

export type AnalysisResult = z.infer<typeof FeedbackAnalysisSchema>;

export interface IFeedback extends Document {
  name: string;
  email: string;
  content: string;
  analysis?: AnalysisResult;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
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

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);