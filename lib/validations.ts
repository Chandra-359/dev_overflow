import { z } from "zod";
export const QuestionsSchema = z.object({
   title: z.string().min(10, "Title must be at least 10 characters long").max(100, "Title must be at most 100 characters long"),
   explanation: z.string().min(20),
   tags: z.array(z.string().min(1).max(15)).min(1, "Please add at least one tag").max(3,"Please add at most 3 tags"),
});

