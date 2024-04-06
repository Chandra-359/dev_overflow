import { z } from "zod";
export const QuestionsSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters long").max(200, "Title must be at most 100 characters long"),
    explanation: z.string().min(20),
    tags: z.array(z.string().min(1).max(15)).min(1, "Please add at least one tag").max(3, "Please add at most 3 tags"),
});

export const AnswerSchema = z.object({
    answer: z.string().min(20),
});

export const ProfileSchema = z.object({
    name: z.string().min(3, "Fullname must be at least 3 characters long").max(50, "Fullname must be at most 50 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be at most 20 characters long"),
    portfolioWebsite: z.string().url().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
})