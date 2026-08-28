import resume from "./resume.generated.json";

const formatRange = (value: string) => {
  const [start, end] = value.split(" -- ");

  return end && start === end ? start : value.replaceAll(" -- ", " — ");
};

const findById = <T extends { id: string }>(items: T[], id: string): T => {
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`ResumeX entry not found: ${id}`);
  }

  return item;
};

const getBullet = <T extends { id: string }>(items: T[], id: string): T =>
  findById(items, id);

export const resumeData = resume;

export const profile = {
  ...resume.meta,
  website: resume.meta.website.replace(/\/$/, ""),
};

const experienceCopy = {
  "exp-sitesmart": {
    summary:
      "Built the serverless FastAPI backend and shipped the React Native product to both app stores. Designed multi-role workflows, authentication, billing, direct-to-S3 uploads, and the PostgreSQL data layer behind daily production use.",
    detail: "AWS Lambda · FastAPI · PostgreSQL · React Native",
    proof: "iOS & Android general availability · 28 merged mobile PRs",
  },
  "exp-swayamrise": {
    summary:
      "Developed Django APIs for student assessment and career guidance, then stabilized the Azure deployment with Nginx routing and a webhook-driven CI/CD pipeline.",
    detail: "Django · Azure · Nginx · GitHub Actions",
    proof: null,
  },
} as const;

export const experience = ["exp-sitesmart", "exp-swayamrise"].map((id) => {
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
  "qr-dining": {
    title: "QR Dining",
    description:
      "A multi-tenant realtime hospitality platform built around shared table sessions, with Redis-backed WebSocket fan-out, idempotent ordering, and strict tenant isolation.",
    proof: "Independent tenant-isolation security review closed",
    caseStudy: null,
  },
  "wal-engine": {
    title: "Production-Grade WAL Engine",
    description:
      "A segmented write-ahead log with CRC32C integrity checks, group commit, deterministic crash recovery, checkpoints, fault injection, and operational tooling.",
    proof: "~1M records/sec replay · 90+ tests · race-safe concurrency",
    caseStudy: "/work/wal-engine",
  },
  "distributed-job-queue": {
    title: "Distributed Job Queue",
    description:
      "Priority scheduling, delayed retries, worker recovery, and end-to-end observability, tested under sustained concurrent load and failure scenarios.",
    proof: "~295K requests · 0 API errors · ~153 req/s breakpoint",
    caseStudy: "/work/distributed-job-queue",
  },
  canvas: {
    title: "Collaborative Canvas",
    description:
      "A URL-shared collaborative drawing surface using Yjs CRDTs and a binary WebSocket protocol, load-tested to find its real operating limits.",
    proof: "150 concurrent users · 100% connection success",
    caseStudy: null,
  },
} as const;

export const projects = Object.entries(projectCopy).map(([id, copy]) => {
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

const selectedOpenSourceIds = [
  "oss-cloud-init",
  "oss-typeshed",
  "oss-heliox",
  "oss-signoz",
];

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
  venue:
    publication.publisher === "Springer Nature Singapore"
      ? `Springer · ${publication.venue}`
      : `IEEE · ${publication.venue.replace(/^202\d IEEE /, "")}`,
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

export const writing = [
  {
    title: "Why Freehand Drawing Becomes a Bottleneck",
    date: "2026-05-05",
    link: "https://blog.mohith16.com/posts/building-canvas-03-freehand-drawing",
  },
  {
    title: "Inside the Rendering Engine of a Canvas App",
    date: "2026-05-03",
    link: "https://blog.mohith16.com/posts/building-canvas-02-rendering-engine",
  },
  {
    title: "What Building a Drawing App Taught Me About Performance",
    date: "2026-04-30",
    link: "https://blog.mohith16.com/posts/building-canvas-01-about",
  },
];

const caseStudyCopy = {
  "wal-engine": {
    slug: "wal-engine",
    eyebrow: "Storage systems",
    challenge:
      "A write-ahead log is only useful when it preserves an unambiguous history through partial writes, corruption, process crashes, and concurrent callers. The project treats recovery behavior—not the append API—as the core product.",
    decisionIds: ["b2", "b3", "b5"],
  },
  "distributed-job-queue": {
    slug: "distributed-job-queue",
    eyebrow: "Distributed systems",
    challenge:
      "Queue APIs often look correct until retries, worker crashes, and ingress beyond processing capacity expose ambiguous state. This system was built around those failure paths and measured under load rather than demonstrated only at happy-path scale.",
    decisionIds: ["b2", "b3", "b4", "b6"],
  },
} as const;

export const caseStudies = Object.entries(caseStudyCopy).map(([id, copy]) => {
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
    intro: getBullet(project.bullets, "b1").text,
    decisions,
    outcomes: project.bullets
      .map((bullet) => bullet.metrics)
      .filter((metric): metric is string => Boolean(metric)),
  };
});
