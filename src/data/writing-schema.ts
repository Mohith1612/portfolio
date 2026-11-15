import { z } from "zod";

export const WRITING_COUNT = 3;
const date = z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, "Invalid calendar date");
const link = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "blog.mohith16.com" && !url.username && !url.password && !url.port;
  } catch { return false; }
}, "Expected an HTTPS blog URL");
export const writingItemSchema = z.object({ title: z.string().refine((value) => value.trim().length > 0, "Title is empty"), date, link }).strict();
export const writingSchema = z.array(writingItemSchema).length(WRITING_COUNT);
export function parseWriting(input: unknown) {
  const result = writingSchema.safeParse(input);
  if (!result.success) throw new Error(`Invalid writing snapshot: ${result.error.issues.map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`).join("; ")}`);
  return result.data;
}
