import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sax from "sax";
import { parseWriting, writingItemSchema, WRITING_COUNT } from "../src/data/writing-schema.ts";

const source = process.env.WRITING_FEED || "https://blog.mohith16.com/rss.xml";
const output = fileURLToPath(new URL("../src/data/writing.generated.json", import.meta.url));
async function readFeed() {
  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source, { signal: AbortSignal.timeout(10000) });
    if (response.status !== 200) throw new Error(`Feed ${source} returned HTTP ${response.status}`);
    return response.text();
  }
  if (/^[a-z][\w+.-]*:/i.test(source) && !source.startsWith("file:")) throw new Error(`Unsupported feed source: ${source}`);
  return readFile(source.startsWith("file:") ? new URL(source) : source, "utf8");
}
function parseFeed(xml) {
  if (!xml.trim()) throw new Error("Empty feed");
  const parser = sax.parser(true, { strictEntities: true });
  const stack = [], items = [];
  let current, field, channels = 0, root = false;
  parser.ondoctype = () => { throw new Error("DTD is not supported"); };
  parser.onopentag = (tag) => {
    stack.push(tag.name);
    if (stack.length === 1) { if (tag.name !== "rss" || tag.attributes.version !== "2.0") throw new Error("Expected RSS 2.0 root"); root = true; }
    if (stack.join("/") === "rss/channel") channels++;
    if (stack.join("/") === "rss/channel/item") current = {};
    if (current && stack.length === 4 && ["title", "link", "pubDate"].includes(tag.name)) {
      if (Object.hasOwn(current, tag.name)) throw new Error(`Duplicate ${tag.name}`);
      field = tag.name; current[field] = "";
    } else if (field && stack.length > 4) throw new Error(`Nested markup in ${field}`);
  };
  parser.ontext = parser.oncdata = (text) => { if (field) current[field] += text; };
  parser.onclosetag = () => {
    if (field && stack.length === 4) field = undefined;
    if (stack.join("/") === "rss/channel/item") { items.push(current); current = undefined; }
    stack.pop();
  };
  parser.write(xml).close();
  if (!root || channels !== 1 || items.length < WRITING_COUNT) throw new Error(`Expected one RSS channel with at least ${WRITING_COUNT} items`);
  return items.map((item, index) => {
    for (const key of ["title", "link", "pubDate"]) if (!item[key]?.trim()) throw new Error(`Item ${index + 1} missing ${key}`);
    const match = item.pubDate.trim().match(/^(?:\w{3},\s*)?(\d{1,2})\s+(\w{3})\s+(\d{4})\s+\d{2}:\d{2}(?::\d{2})?\s+(?:GMT|UT|[+-]\d{4})$/i);
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = match ? months.indexOf(match[2].toLowerCase()) : -1;
    const timestamp = Date.parse(item.pubDate);
    if (!match || month < 0 || +match[1] < 1 || +match[1] > new Date(Date.UTC(+match[3], month + 1, 0)).getUTCDate() || !Number.isFinite(timestamp)) throw new Error(`Item ${index + 1} has invalid pubDate`);
    const row = { title: item.title.trim(), date: new Date(timestamp).toISOString().slice(0, 10), link: item.link.trim() };
    const result = writingItemSchema.safeParse(row);
    if (!result.success) throw new Error(`Item ${index + 1}: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    return { row, timestamp, index };
  }).sort((a, b) => b.timestamp - a.timestamp || a.index - b.index).slice(0, WRITING_COUNT).map(({ row }) => row);
}
try {
  const rows = parseWriting(parseFeed(await readFeed()));
  await writeFile(output, `${JSON.stringify(rows, null, 2)}\n`);
  console.log(`Synced ${rows.length} writing posts to src/data/writing.generated.json`);
} catch (error) { console.error(`Writing sync failed: ${error.message}`); process.exitCode = 1; }
