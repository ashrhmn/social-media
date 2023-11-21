import { z } from "zod";

export const signUpFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  userId: z.string().uuid("Invalid user ID"),
  dateOfBirth: z.coerce
    .date()
    .refine(
      (date) => date.valueOf() < Date.now() - 18 * 365 * 24 * 60 * 60 * 1000,
      { message: "You must be at least 18 years old" }
    ),
});
