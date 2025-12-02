import { z } from "zod";

export const createWorkOrderSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(5, "Description is required"),
  orderIds: z.array(z.string()).nonempty("Order IDs are required"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed", "Cancelled"], {
    required_error: "Status is required",
  }),
});
