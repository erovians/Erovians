import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  status: z.enum(["To Do", "Doing", "Review", "Done"], {
    required_error: "Status is required",
  }),
});
