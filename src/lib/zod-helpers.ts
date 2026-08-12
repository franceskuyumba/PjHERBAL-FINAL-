import { z } from "zod";

/**
 * Safely parses a value with a Zod schema and returns a friendly
 * first error message when validation fails.
 */
export function zodParseSafe<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown
):
  | { ok: true; data: z.infer<T> }
  | { ok: false; message: string } {
  const result = schema.safeParse(value);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  const issue = result.error.issues[0];
  const message = issue?.message || "Please check your details and try again.";
  return { ok: false, message };
}
