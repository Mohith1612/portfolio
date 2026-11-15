import writingSnapshot from "./writing.generated.json";
import { parseWriting } from "./writing-schema";
import { getCollection } from "astro:content";
import { experienceIds, projectIds, selectedOpenSourceIds, caseStudyProjectIds, caseStudyBulletIds } from "@/data/curation";
import snapshot from "./resume.generated.json";
import { parseResume, type Resume } from "./resumex-schema";

import { formatRange, formatPublicationVenue } from "@/lib/format";
import { findById, getBullet } from "@/lib/select";

const resume: Resume = parseResume(snapshot);

export const resumeData = resume;

export const profile = {
  ...resume.meta,
  website: resume.meta.website.replace(/\/$/, ""),
};

const experienceCopy = {
  [experienceIds[0]]: {
    summary:
      "Built the serverless FastAPI backend and shipped the React Native product to both app stores. Designed multi-role workflows, authentication, billing, direct-to-S3 uploads, and the PostgreSQL data layer, then led a typed-API refactor of the app and made money creates retry-safe on flaky site networks.",
    detail: "AWS Lambda · FastAPI · PostgreSQL · React Native",
    proof:
      "iOS & Android general availability · 259 mobile + 156 backend merged PRs",
  },
  [experienceIds[1]]: {
    summary:
      "Developed Django APIs for student assessment and career guidance, then stabilized the Azure deployment with Nginx routing and a webhook-driven CI/CD pipeline.",
    detail: "Django · Azure · Nginx · GitHub Actions",
    proof: null,
  },
} as const;

export const experience = experienceIds.map((id) => {
  const item = findById(resume.experience, id);

  return {
    id,
    company: item.company.replace(" (formerly MyCareerMyWay)", ""),
    role: item.role,
    period: formatRange(item.dates),
    ...experienceCopy[id as keyof typeof experienceCopy],
  };
});

const projectCopy = {
  [projectIds[0]]: {
    title: "QR Dining",
    description:
      "A multi-tenant realtime hospitality platform built around shared table sessions, with Redis-backed WebSocket fan-out, idempotent ordering, and strict tenant isolation.",
    proof: "Independent tenant-isolation security review closed",
    caseStudy: null,
  },
  [projectIds[1]]: {
    title: "Production-Grade WAL Engine",
    description:
      "A segmented write-ahead log with CRC32C integrity checks, group commit, deterministic crash recovery, checkpoints, fault injection, and operational tooling.",
    proof: "~1M records/sec replay · 90+ tests · race-safe concurrency",
    caseStudy: "/work/wal-engine",
  },
  [projectIds[2]]: {
    title: "Distributed Job Queue",
    description:
      "Priority scheduling, delayed retries, worker recovery, and end-to-end observability, tested under sustained concurrent load and failure scenarios.",
    proof: "~295K requests · 0 API errors · ~153 req/s breakpoint",
    caseStudy: "/work/distributed-job-queue",
  },
  [projectIds[3]]: {
    title: "Collaborative Canvas",
    description:
      "A URL-shared collaborative drawing surface using Yjs CRDTs and a binary WebSocket protocol, load-tested to find its real operating limits.",
    proof: "150 concurrent users · 100% connection success",
    caseStudy: null,
  },
} as const;

export const projects = projectIds.map((id) => {
  const copy = projectCopy[id];
  const item = findById(resume.projects, id);

  return {
    id,
    ...copy,
    period: formatRange(item.dates),
    tech: item.tech.join(" · "),
    live: item.links.live,
    github: item.links.github,
  };
});

export const openSource = selectedOpenSourceIds.map((id) => {
  const item = findById(resume.openSource, id);
  const leadContribution = item.bullets[0];
  const merged = item.prs.merged;
  const open = item.prs.open;

  return {
    id,
    project: item.project,
    organization: item.org,
    description: `${leadContribution.text}; ${leadContribution.impact}`,
    contribution:
      merged > 0
        ? `${merged} merged PR${merged === 1 ? "" : "s"}`
        : `${open} open PR${open === 1 ? "" : "s"}`,
    contributionLink: leadContribution.url,
    repo: item.repo,
  };
});

export const publications = resume.publications.map((publication) => ({
  id: publication.id,
  title: publication.title,
  venue: formatPublicationVenue(publication),
  year: String(publication.year),
  link: publication.links.doi,
}));

const skills = Object.fromEntries(
  resume.skills.map((group) => [group.category, group.items]),
);

export const skillGroups = [
  {
    label: "Systems",
    items: [...skills.Languages, ...skills["Data & Messaging"]].join(", "),
  },
  {
    label: "Infrastructure",
    items: skills["Infrastructure & Cloud"].join(", "),
  },
  {
    label: "Observability",
    items: skills["Observability & Testing"].join(", "),
  },
];

export const education = resume.education.map((item) => ({
  ...item,
  dates: formatRange(item.dates),
}));

export const writing = parseWriting(writingSnapshot);

const entries = await getCollection("case-studies");
const curatedIds = new Set<string>(caseStudyProjectIds);
const documents = new Map<string, (typeof entries)[number]>();
for (const entry of entries) {
  if (!curatedIds.has(entry.id)) throw new Error(`Unknown case-study file: ${entry.id}`);
  if (entry.data.projectId !== entry.id) throw new Error(`Case-study identity mismatch: ${entry.id} and ${entry.data.projectId}`);
  if (!entry.body?.trim()) throw new Error(`Empty case-study challenge: ${entry.id}`);
  if (documents.has(entry.id)) throw new Error(`Duplicate case-study identity: ${entry.id}`);
  documents.set(entry.id, entry);
}

export const caseStudies = caseStudyProjectIds.map((id) => {
  const entry = documents.get(id);
  if (!entry) throw new Error(`Missing case-study Markdown: ${id}`);
  if (!entry.body?.trim()) throw new Error(`Empty case-study challenge: ${id}`);
  const copy = {
    slug: id,
    eyebrow: entry.data.eyebrow,
    challenge: entry.body.trim(),
    decisionIds: caseStudyBulletIds[id].decisionIds,
  };
  const project = findById(resume.projects, id);
  const homepageProject = projects.find((item) => item.id === id);

  if (!homepageProject) {
    throw new Error(`Homepage project not found for case study: ${id}`);
  }

  const decisions = copy.decisionIds.map((bulletId) => {
    const bullet = getBullet(project.bullets, bulletId);

    return {
      id: bullet.id,
      text: bullet.text,
      impact: bullet.impact,
      metric: bullet.metrics,
    };
  });

  return {
    ...copy,
    ...homepageProject,
    intro: getBullet(project.bullets, caseStudyBulletIds[id].introBulletId).text,
    decisions,
    outcomes: project.bullets
      .map((bullet) => bullet.metrics)
      .filter((metric): metric is string => Boolean(metric)),
  };
});
