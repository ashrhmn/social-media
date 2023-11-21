import { z } from "zod";

export const editPostFormSchema = z
  .object({
    media: z
      .instanceof(File)
      .refine((f) => f.size < 10_000_000, "File size must be less than 10MB")
      .refine((f) => f.type.startsWith("image/"), "File must be an image")
      .optional(),
    content: z.string().optional(),
    userId: z.string().uuid(),
    postId: z.string().uuid(),
    platformUserId: z.string().uuid(),
    existingMediaUrl: z.string().url().optional(),
  })
  .superRefine(({ content, media, existingMediaUrl }, ctx) => {
    if (!content && !media && !existingMediaUrl)
      ctx.addIssue({
        message: "Post must have content or media",
        path: ["content"],
        code: "custom",
      });
  });
