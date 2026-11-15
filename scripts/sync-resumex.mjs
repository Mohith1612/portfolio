import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";
import { parseResume } from "../src/data/resumex-schema.ts";

const sourceDirectory = process.env.RESUMEX_DATA_DIR
  ? path.resolve(process.env.RESUMEX_DATA_DIR)
  : path.resolve(process.cwd(), "../../projects/resumex/data/mohith");

const outputFile = path.resolve(
  process.cwd(),
  "src/data/resume.generated.json",
);

const sources = {
  meta: "meta.yaml",
  experience: "experience.yaml",
  projects: "projects.yaml",
  openSource: "opensource.yaml",
  publications: "publications.yaml",
  skills: "skills.yaml",
  education: "education.yaml",
};

const resume = {};

for (const [key, filename] of Object.entries(sources)) {
  const sourceFile = path.join(sourceDirectory, filename);

  try {
    resume[key] = parse(await readFile(sourceFile, "utf8"));
  } catch (error) {
    throw new Error(
      `Unable to read ${sourceFile}. Set RESUMEX_DATA_DIR to the directory containing Mohith's ResumeX YAML files.`,
      { cause: error },
    );
  }
}

if (resume.meta !== null && typeof resume.meta === "object") delete resume.meta.phone;
parseResume(resume);

const expected = `${JSON.stringify(resume, null, 2)}\n`;

if (process.argv.includes("--check")) {
  let actual;
  try {
    actual = await readFile(outputFile, "utf8");
  } catch (error) {
    throw new Error(`Unable to read ResumeX snapshot at ${outputFile}`, { cause: error });
  }
  if (actual === expected) {
    console.log("ResumeX snapshot is up to date");
  } else {
    let snapshot;
    try {
      snapshot = JSON.parse(actual);
    } catch (error) {
      throw new Error(`Invalid ResumeX snapshot JSON at ${outputFile}`, { cause: error });
    }
    const keys = new Set([...Object.keys(resume), ...Object.keys(snapshot ?? {})]);
    const differences = [...keys].filter((key) =>
      !Object.hasOwn(resume, key) || !Object.hasOwn(snapshot ?? {}, key) ||
      JSON.stringify(resume[key]) !== JSON.stringify(snapshot[key]),
    );
    console.error(`ResumeX snapshot differs: ${differences.join(", ") || "snapshot serialization (key order/formatting)"}`);
    process.exitCode = 1;
  }
} else {
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, expected);
  console.log(`Synced ResumeX data to ${path.relative(process.cwd(), outputFile)}`);
}
