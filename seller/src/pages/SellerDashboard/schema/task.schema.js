import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  status: z.enum(["To Do", "Doing", "Review", "Done"], {
    required_error: "Status is required",
  }),
});