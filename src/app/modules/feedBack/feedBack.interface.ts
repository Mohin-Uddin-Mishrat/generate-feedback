export type TPriority = "Low" | "Medium" | "High" | "Critical";

export type TSentiment = "Positive" | "Neutral" | "Negative";

export type TFeedbackAnalysis = {
    category: string;
    priority: TPriority;
    sentiment: TSentiment;
    team: string;
};

export type TCreateFeedbackPayload = {
    name: string;
    email: string;
    content: string;
};

export type TFeedbackQuery = {
    search?: string;
    category?: string;
    priority?: string;
    sentiment?: string;
    team?: string;
};
