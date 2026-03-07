import { z } from "zod";

const create_feedback_validation = z.object({
    name: z.string({ message: "Name is required" }).min(1, "Name cannot be empty"),
    email: z.string({ message: "Email is required" }).email("Invalid email address"),
    content: z.string({ message: "Feedback content is required" }).min(5, "Content must be at least 5 characters"),
});

export const feedback_validation = {
    create_feedback_validation,
};
