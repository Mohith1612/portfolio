import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  "case-studies": defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
    schema: z.object({ projectId: z.string().trim().min(1), eyebrow: z.string().trim().min(1) }).strict(),
  }),
};
