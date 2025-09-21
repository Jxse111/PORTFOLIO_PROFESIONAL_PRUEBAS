import { getPosts } from "@/utils/utils";
import { Grid, Text } from "@once-ui-system/core";
import Post from "./Post";

interface PostType {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
    image?: string;
    tags?: string[];
  };
  content: string;
}

interface PostsProps {
  posts?: PostType[];
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
}

export function Posts({
  posts: customPosts,
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: PostsProps) {
  // Si no se proporcionan posts personalizados, obtén todos los posts
  let allBlogs = customPosts || getPosts(["src", "app", "blog", "posts"]);

  // Excluir por slug (coincidencia exacta)
  if (exclude.length) {
    allBlogs = allBlogs.filter((post) => !exclude.includes(post.slug));
  }

  // Ordenar por fecha de publicación
  const sortedBlogs = [...allBlogs].sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  // Aplicar rango si se especifica
  const displayedBlogs = range
    ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
    : sortedBlogs;

  if (displayedBlogs.length === 0) {
    return (
      <Text variant="body-default-m" style={{ textAlign: 'center', padding: '2rem 0' }}>
        No se encontraron publicaciones con los filtros seleccionados.
      </Text>
    );
  }

  return (
    <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
      {displayedBlogs.map((post) => (
        <Post key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
      ))}
    </Grid>
  );
}
