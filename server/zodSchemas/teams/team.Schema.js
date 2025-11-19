import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 letters"),
  email: z.string().email("Invalid email format"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile must be 10 digits"),
  role: z.string().min(1, "Role is required"),
  site: z.string().url("Invalid URL format").optional().or(z.literal("")),
  photoFile: z.any().optional(),
  photo: z.string().optional(),
});
