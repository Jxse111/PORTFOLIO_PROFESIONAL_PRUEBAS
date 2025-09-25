import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "notified.json");

type NotifiedData = { slugs: string[] };

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ slugs: [] } satisfies NotifiedData, null, 2));
  }
}

export function readNotifiedSlugs(): string[] {
  ensureStore();
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    const data = JSON.parse(raw) as NotifiedData;
    return Array.isArray(data.slugs) ? data.slugs : [];
  } catch {
    return [];
  }
}

export function addNotifiedSlug(slug: string) {
  ensureStore();
  const slugs = readNotifiedSlugs();
  if (slugs.includes(slug)) return;
  slugs.push(slug);
  fs.writeFileSync(FILE_PATH, JSON.stringify({ slugs }, null, 2));
}
