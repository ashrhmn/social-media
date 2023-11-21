import { z } from "zod";

export const createPostFormSchema = z
  .object({
    media: z
      .instanceof(File)
      .refine((f) => f.size < 10_000_000, "File size must be less than 10MB")
      .refine((f) => f.type.startsWith("image/"), "File must be an image")
      .optional(),
    content: z.string().optional(),
    userId: z.string().uuid(),
    platformUserId: z.string().uuid(),
  })
  .superRefine(({ content, media }, ctx) => {
    if (!content && !media)
      ctx.addIssue({
        message: "Post must have content or media",
        path: ["content"],
        code: "custom",
      });
  });
