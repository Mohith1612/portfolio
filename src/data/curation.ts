// Controls experience display order using ResumeX ids.
export const experienceIds = ["exp-sitesmart", "exp-swayamrise"] as const;
// Controls project display order using ResumeX ids.
export const projectIds = ["qr-dining", "wal-engine", "distributed-job-queue", "canvas"] as const;
// Controls selected open-source work using ResumeX ids.
export const selectedOpenSourceIds = ["oss-floci", "oss-cloud-init", "oss-typeshed", "oss-heliox"] as const;
// Controls résumé experience bullets using ResumeX ids.
export const selectedExperienceBulletIds: Readonly<Record<string, readonly string[]>> = {
  [experienceIds[0]]: ["b1", "b9", "b13", "b14", "b15", "b5"],
};
// Controls case study display order using ResumeX ids.
export const caseStudyProjectIds = [projectIds[1], projectIds[2]] as const;
// Controls case study introductions and decisions using ResumeX ids.
export const caseStudyBulletIds = {
  [caseStudyProjectIds[0]]: { introBulletId: "b1", decisionIds: ["b2", "b3", "b5"] },
  [caseStudyProjectIds[1]]: { introBulletId: "b1", decisionIds: ["b2", "b3", "b4", "b6"] },
} as const satisfies Record<(typeof caseStudyProjectIds)[number], { readonly introBulletId: string; readonly decisionIds: readonly string[] }>;
