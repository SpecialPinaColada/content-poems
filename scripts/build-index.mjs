// Reads poems/*.md and writes index.json (what the website lists on its home page).
// Fails loudly on bad frontmatter so mistakes are caught on push.
import { readdir, readFile, writeFile } from "node:fs/promises";
import YAML from "yaml";

const dir = "poems";
const entries = [];
let failed = false;
const fail = (msg) => { console.error(msg); failed = true; };
const clip = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

for (const file of (await readdir(dir)).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  if (!/^[\w-]+$/.test(slug)) { fail(`${file}: use only letters, numbers, - and _ in file names`); continue; }

  const raw = (await readFile(`${dir}/${file}`, "utf8")).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) { fail(`${file}: missing frontmatter block`); continue; }

  const data = YAML.parse(match[1]) ?? {};
  if (!data.title) { fail(`${file}: missing title`); continue; }
  if (data.draft === true) continue;

  const body = match[2].trim();
  const tidy = (s) => s.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const excerpt = clip(tidy(body), 260);

  // Pull quote for the featured spot: `quote:` in frontmatter, or the first lines of the poem
  const firstLines = body.split(/\n[ \t]*\n/)[0].split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 3).join(" ");
  const quote = data.quote ? String(data.quote).trim() : clip(firstLines, 140);

  entries.push({
    slug,
    title: String(data.title),
    date: data.date ? String(data.date) : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    excerpt,
    featured: data.featured === true,
    quote,
  });
}

entries.sort((a, b) => b.date.localeCompare(a.date));
await writeFile("index.json", JSON.stringify(entries, null, 2) + "\n");
console.log(`Wrote index.json with ${entries.length} poems`);
if (failed) process.exit(1);