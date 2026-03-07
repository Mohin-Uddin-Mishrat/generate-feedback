"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedback_validation = void 0;
const zod_1 = require("zod");
const create_feedback_validation = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }).min(1, "Name cannot be empty"),
    email: zod_1.z.string({ message: "Email is required" }).email("Invalid email address"),
    content: zod_1.z.string({ message: "Feedback content is required" }).min(5, "Content must be at least 5 characters"),
});
exports.feedback_validation = {
    create_feedback_validation,
};
