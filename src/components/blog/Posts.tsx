"use client";

import { Grid, Text } from "@once-ui-system/core";
import Post from "./Post";

export interface PostType {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
    image?: string;
    tags?: string[];
    // Propiedades adicionales que podrían estar presentes
    images?: string[];
    tag?: string | string[];
    team?: Array<{
      name: string;
      role: string;
      avatar: string;
      linkedIn: string;
    }>;
    link?: string;
  };
  content: string;
}

interface PostsProps {
  posts?: PostType[];
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  exclude?: string[];
  direction?: "row" | "column";
}

export default function Posts({
  posts: customPosts = [],
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: PostsProps) {
  const [start, end] = range || [0, customPosts.length];
  const filteredPosts = customPosts.filter((post) => !exclude.includes(post.slug));
  const displayedPosts = filteredPosts.slice(start, end);

  if (displayedPosts.length === 0) {
    return (
      <Text variant="body-default-m" style={{ textAlign: 'center', padding: '2rem 0' }}>
        No se encontraron publicaciones con los filtros seleccionados.
      </Text>
    );
  }

  return (
    <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
      {displayedPosts.map((post: PostType) => (
        <Post 
          key={post.slug}
          post={{
            slug: post.slug,
            metadata: {
              title: post.metadata.title,
              summary: post.metadata.summary,
              publishedAt: post.metadata.publishedAt,
              image: post.metadata.image,
              tags: post.metadata.tags
            }
          }}
          thumbnail={thumbnail}
          direction={direction}
        />
      ))}
    </Grid>
  );
}
