import { z } from "zod";

const s = z.string();
const strings = z.array(s);
const nullable = s.nullable();
const bullet = z.object({ id: s, text: s, impact: s, metrics: nullable }).passthrough();
const linkedBullet = bullet.extend({ url: s }).passthrough();
const requiredSkills = ["Languages", "Data & Messaging", "Infrastructure & Cloud", "Observability & Testing"];

export const resumeSchema = z.object({
  meta: z.object({ name: s, email: s, location: s, linkedin: s, github: s, website: s, blog: s, scholar: s }).passthrough(),
  experience: z.array(z.object({ id: s, company: s, role: s, dates: s, location: s, tags: strings, links: z.object({ company: nullable }).passthrough(), bullets: z.array(bullet) }).passthrough()),
  projects: z.array(z.object({ id: s, name: s, dates: s, tags: strings, tech: strings, links: z.object({ github: nullable, live: nullable }).passthrough(), bullets: z.array(bullet) }).passthrough()),
  openSource: z.array(z.object({ id: s, project: s, org: s, repo: s, description: s, role: s, dates: s, tags: strings, prs: z.object({ merged: z.number(), open: z.number() }).passthrough(), bullets: z.array(linkedBullet).min(1) }).passthrough()),
  publications: z.array(z.object({ id: s, title: s, venue: s, pages: s, type: s, authors: strings, tags: strings, author_position: z.number(), year: z.number(), citations: z.number(), links: z.object({ doi: s, paper: nullable }).passthrough(), series: s.optional(), publisher: z.enum(["Apple Academic Press", "IEEE", "Springer Nature Singapore"]) }).passthrough()),
  skills: z.array(z.object({ category: s, items: strings }).passthrough()).superRefine((skills, ctx) => {
    for (const category of requiredSkills) if (!skills.some((skill) => skill.category === category)) ctx.addIssue({ code: "custom", message: `Missing skill category: ${category}` });
  }),
  education: z.array(z.object({ id: s, school: s, location: s, degree: s, dates: s }).passthrough()).min(1),
}).passthrough();

export type Resume = z.infer<typeof resumeSchema>;

export function parseResume(input: unknown): Resume {
  const result = resumeSchema.safeParse(input);
  if (!result.success) throw new Error(`Invalid ResumeX snapshot: ${result.error.issues.map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`).join("; ")}`);
  return result.data;
}
