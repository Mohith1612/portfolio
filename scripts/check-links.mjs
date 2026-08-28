import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const html = await readFile(path.resolve(process.cwd(), "dist/index.html"), "utf8");
const urls = [
  ...new Set(
    [...html.matchAll(/href="(https:\/\/[^"#]+)"/g)].map((match) =>
      match[1].replaceAll("&amp;", "&"),
    ),
  ),
];

const failures = [];

for (const url of urls) {
  try {
    let response = await fetch(url, { method: "HEAD", redirect: "follow" });

    if (response.status === 405) {
      response = await fetch(url, { redirect: "follow" });
    }

    if (response.status >= 400) {
      failures.push(`${response.status} ${url}`);
    }
  } catch (error) {
    failures.push(`${error.message} ${url}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${urls.length} external links.`);
}
