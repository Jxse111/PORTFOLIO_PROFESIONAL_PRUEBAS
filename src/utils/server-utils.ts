import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { readNotifiedSlugs, addNotifiedSlug } from "@/lib/storage/notified";
import { baseURL } from "@/resources";

export type ServerPost = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images?: string[];
    tags?: string[];
    team?: Array<{
      name: string;
      role: string;
      avatar: string;
      linkedIn: string;
    }>;
    link?: string;
  };
  content: string;
};

export function getServerPosts(): ServerPost[] {
  const postsDirectory = path.join(process.cwd(), "src", "app", "blog", "posts");

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));

  const posts: ServerPost[] = fileNames.map(fileName => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: fileName.replace(/\.mdx$/, ""),
      metadata: {
        title: data.title || "",
        publishedAt: data.publishedAt || "",
        summary: data.summary || "",
        image: data.image || undefined,
        images: Array.isArray(data.images) ? data.images : [],
        tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
        team: Array.isArray(data.team) ? data.team : [],
        link: data.link || undefined,
      },
      content: content || "",
    };
  });

  // Hook automático de notificaciones (no bloqueante):
  // Solo en prod y si AUTO_NOTIFY === 'true'. Marca slugs enviados para no repetir.
  try {
    if (process.env.AUTO_NOTIFY === 'true' && process.env.NODE_ENV === 'production') {
      const notified = new Set(readNotifiedSlugs());
      const secret = process.env.NEWSLETTER_WEBHOOK_SECRET;
      const site = process.env.SITE_BASE_URL || baseURL || "";

      if (secret && site) {
        posts
          .filter(p => !notified.has(p.slug))
          .forEach(p => {
            safeNotify({
              title: p.metadata.title,
              url: `${site}/blog/${encodeURIComponent(p.slug)}`,
              summary: p.metadata.summary,
              secret,
            }).then(ok => {
              if (ok) addNotifiedSlug(p.slug);
            }).catch(() => {});
          });
      }
    }
  } catch (e) {
    console.warn("AUTO_NOTIFY hook failed", e);
  }

  return posts;
}

// Utilidad: notificar sin lanzar excepción
async function safeNotify(payload: { title: string; url: string; summary?: string; secret: string }): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.SITE_BASE_URL || ''}/api/newsletter/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({} as { ok?: boolean }));
    return !!data.ok;
  } catch {
    return false;
  }
}