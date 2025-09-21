import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

export type ServerPost = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tag?: string | string[];
    team: Array<{
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
  
  return fileNames.map(fileName => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    
    return {
      slug: fileName.replace(/\.mdx$/, ""),
      metadata: {
        title: data.title || "",
        publishedAt: data.publishedAt,
        summary: data.summary || "",
        image: data.image || "",
        images: data.images || [],
        tags: Array.isArray(data.tag) ? data.tag : data.tag ? [data.tag] : [],
        team: data.team || [],
        link: data.link || "",
      },
      content: content || "",
    };
  });
}