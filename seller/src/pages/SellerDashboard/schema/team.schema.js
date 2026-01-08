import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2, "name is required"),
  email: z.string().email("email is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "mobile is required"),
  role: z.string().min(1, "Role is required"),
  photoFile: z.any().optional(),
  photo: z.string().nullable().optional(),
});
