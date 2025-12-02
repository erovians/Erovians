import { z } from "zod";

export const createWorkOrderSchema = z.object({
  wo_number: z.string().min(1, "WO number is required"),
  so_number: z.string().min(1, "SO number is required"),
  machine: z.string().min(1, "Machine name is required"),
  due_date: z
    .string()
    .or(z.date())
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid date"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["Planned", "Running", "Completed"], {
    required_error: "Status is required",
  }),
});
