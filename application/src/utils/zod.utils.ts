import { ZodError, ZodTypeAny, z } from "zod";

export const zodErrorToFormError = (error: ZodError) =>
  Object.fromEntries(
    Object.entries(error.flatten().fieldErrors)
      .map(([k, v]) => [k, v?.join(", ")])
      .filter(([_, v]) => !!v)
  ) as Record<string, string>;

export const zodParse = <T extends ZodTypeAny>(
  schema: T,
  data: unknown
): { data: z.infer<T> } | { errors: Record<keyof z.infer<T>, string> } => {
  try {
    return { data: schema.parse(data) };
  } catch (error) {
    if (error instanceof ZodError) {
      // console.log({ error });
      return { errors: zodErrorToFormError(error) as any };
    } else throw error;
  }
};

export type PartialZodProperties<T extends ZodTypeAny> = Partial<
  Record<keyof z.infer<T>, string | undefined>
>;

export type PartialZodPropertiesWithError<T extends ZodTypeAny> = Partial<
  Record<keyof z.infer<T> | "error", string | undefined>
>;

export type ZFormHandler<T extends ZodTypeAny> = (
  prevState: PartialZodPropertiesWithError<T>,
  formData: FormData
) => Promise<PartialZodPropertiesWithError<T>>;

export const createFormHandler = <T extends ZodTypeAny>(
  schema: T,
  handler: (
    data: z.output<T>,
    prevState: PartialZodPropertiesWithError<T>,
    formData: FormData
  ) =>
    | PartialZodPropertiesWithError<T>
    | Promise<PartialZodPropertiesWithError<T>>
): ZFormHandler<T> => {
  return async (prevState, formData) => {
    const rawData = Object.fromEntries(formData.entries());
    const data = Object.fromEntries(
      Object.entries(rawData)
        .filter(([_, v]) => !!v)
        .filter(([_, v]) => !(v instanceof File) || v.size > 0)
    );
    const validation = zodParse(schema, data);
    if ("errors" in validation) {
      return validation.errors;
    }
    return handler(validation.data, prevState, formData);
  };
};

export const fileListSchema = (maxCount = 5, maxSizeInBytes = 10_000_000) =>
  z
    .instanceof(FileList)
    .refine((x) => Array.from(x).length <= maxCount, "Attachment is required")
    .refine(
      (x) =>
        Array.from(x).filter((file) => file.size > maxSizeInBytes).length === 0,
      "File size too large"
    );
