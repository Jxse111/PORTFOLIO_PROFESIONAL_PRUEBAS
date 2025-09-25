import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "newsletter.json");

export type Subscriber = {
  email: string;
  subscribedAt: string; // ISO
};

type NewsletterData = {
  subscribers: Subscriber[];
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ subscribers: [] } satisfies NewsletterData, null, 2));
  }
}

export function readSubscribers(): Subscriber[] {
  ensureStore();
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    const data = JSON.parse(raw) as NewsletterData;
    return Array.isArray(data.subscribers) ? data.subscribers : [];
  } catch {
    return [];
  }
}

export function addSubscriber(email: string): { added: boolean } {
  ensureStore();
  const subs = readSubscribers();
  const exists = subs.some((s) => s.email === email);
  if (exists) return { added: false };
  subs.push({ email, subscribedAt: new Date().toISOString() });
  fs.writeFileSync(FILE_PATH, JSON.stringify({ subscribers: subs } satisfies NewsletterData, null, 2));
  return { added: true };
}
