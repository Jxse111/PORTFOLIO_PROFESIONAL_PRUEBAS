"use client";

import { useMemo } from "react";
import { Grid, Text, Column } from "@once-ui-system/core";
import { RelatedPostsProps, RelatedPostScore } from "@/types/blog-utils.types";
import { PostType } from "@/components/blog/Posts";
import Post from "./Post";

export function RelatedPosts({
  currentPost,
  allPosts,
  maxRelated = 4,
  className,
  showFallback = true
}: RelatedPostsProps) {
  // Calcular posts relacionados
  const relatedPosts = useMemo((): RelatedPostScore[] => {
    const currentTags = currentPost.metadata.tags || [];
    const relatedScores: RelatedPostScore[] = [];

    // Filtrar posts que no sean el actual
    const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);

    // Si no hay otros posts, devolver array vacío
    if (otherPosts.length === 0) {
      return [];
    }

    // Calcular puntuación de similitud
    otherPosts.forEach(post => {
      const postTags = post.metadata.tags || [];
      let score = 0;
      let reason: 'tags' | 'recent' | 'random' = 'random';

      // Puntuación basada en etiquetas comunes
      const commonTags = currentTags.filter(tag => postTags.includes(tag));
      if (commonTags.length > 0) {
        score = commonTags.length * 10; // 10 puntos por etiqueta común
        reason = 'tags';
      }

      // Bonus por posts recientes (menos de 30 días)
      const postDate = new Date(post.metadata.publishedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (postDate > thirtyDaysAgo) {
        score += 5;
        if (reason === 'random') reason = 'recent';
      }

      // Si no tiene puntuación, dar una base para posts aleatorios
      if (score === 0) {
        score = Math.random() * 2; // Puntuación aleatoria baja
      }

      relatedScores.push({
        post,
        score,
        reason
      });
    });

    // Ordenar por puntuación descendente
    const sorted = relatedScores.sort((a, b) => b.score - a.score);

    // Si no hay posts con puntuación significativa y showFallback es true,
    // mostrar posts recientes
    if (sorted.length === 0 || (sorted[0]?.score < 5 && showFallback)) {
      const recentPosts = otherPosts
        .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
        .slice(0, maxRelated)
        .map(post => ({
          post,
          score: 1,
          reason: 'recent' as const
        }));

      return recentPosts;
    }

    return sorted.slice(0, maxRelated);
  }, [currentPost, allPosts, maxRelated, showFallback]);

  // Calcular número de columnas basado en el número de posts
  const columns = useMemo(() => {
    if (relatedPosts.length <= 1) return "1";
    if (relatedPosts.length === 2) return "2";
    if (relatedPosts.length === 3) return "3";
    return "2"; // Para 4+ posts, usar 2 columnas
  }, [relatedPosts.length]);

  if (relatedPosts.length === 0) {
    return (
      <div className={className}>
        <Text variant="body-default-s" style={{ textAlign: 'center', color: 'var(--color-neutral-medium)' }}>
          No hay posts relacionados disponibles
        </Text>
      </div>
    );
  }

  return (
    <div className={className}>
      <Column fillWidth gap="16">
        <Text variant="heading-strong-l">
          Artículos relacionados
        </Text>

        <Grid
          columns={columns}
          s={{ columns: 1 }}
          fillWidth
          gap="16"
        >
          {relatedPosts.map(({ post, reason }) => (
            <Post
              key={post.slug}
              post={{
                slug: post.slug,
                metadata: {
                  title: post.metadata.title,
                  summary: post.metadata.summary,
                  publishedAt: post.metadata.publishedAt,
                  image: post.metadata.image,
                  tags: post.metadata.tags || []
                }
              }}
              thumbnail={true}
              direction="column"
            />
          ))}
        </Grid>

        {/* Información de por qué se muestran estos posts */}
        {relatedPosts.length > 0 && (
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {relatedPosts[0]?.reason === 'tags'
              ? 'Basado en etiquetas comunes'
              : 'Posts recientes del blog'
            }
          </Text>
        )}
      </Column>
    </div>
  );
}

export default RelatedPosts;
