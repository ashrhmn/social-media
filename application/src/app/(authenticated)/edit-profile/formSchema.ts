import { fileListSchema } from "@/utils/zod.utils";
import { z } from "zod";

export const updateProfileFormSchema = z.object({
  dateOfBirth: z.coerce
    .date()
    .refine(
      (date) => date.valueOf() < Date.now() - 18 * 365 * 24 * 60 * 60 * 1000,
      { message: "You must be at least 18 years old" }
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  userId: z.string().uuid("Invalid user ID"),
  platformUserId: z.string().uuid("Invalid user ID"),
  bio: z.string().min(8, "Bio must be at least 8 characters long").optional(),
  gender: z.string(),
  website: z.string().url().optional(),
  avatar: z
    .instanceof(File)
    .refine((f) => f.size < 10_000_000, "File size must be less than 10MB")
    .refine((f) => f.type.startsWith("image/"), "File must be an image")
    .optional(),
});
