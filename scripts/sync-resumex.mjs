import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";

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

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(resume, null, 2)}\n`);

console.log(`Synced ResumeX data to ${path.relative(process.cwd(), outputFile)}`);
