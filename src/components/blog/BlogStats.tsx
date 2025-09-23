"use client";

import { useMemo } from "react";
import { Card, Column, Row, Text } from "@once-ui-system/core";
import { BlogStatsProps, BlogStatistics, PostType } from "@/types/blog-utils.types";

export function BlogStats({
  posts,
  className,
  showTopTags = true,
  maxTopTags = 3
}: BlogStatsProps) {
  // Calcular estadísticas del blog
  const statistics = useMemo((): BlogStatistics => {
    const totalPosts = posts.length;
    const uniqueTags = new Set<string>();
    let totalReadingTime = 0;
    const tagCounts = new Map<string, number>();

    posts.forEach((post) => {
      // Contar etiquetas únicas
      const tags = post.metadata.tags || [];
      tags.forEach(tag => {
        uniqueTags.add(tag);
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });

      // Calcular tiempo de lectura estimado (basado en 200 palabras por minuto)
      const wordCount = post.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // minutos
      totalReadingTime += readingTime;
    });

    // Calcular top tags
    const topTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({
        tag,
        count,
        percentage: Math.round((count / totalPosts) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxTopTags);

    const averageReadingTime = totalPosts > 0 ? Math.round(totalReadingTime / totalPosts) : 0;

    return {
      totalPosts,
      uniqueTags: uniqueTags.size,
      totalReadingTime,
      topTags,
      averageReadingTime
    };
  }, [posts, maxTopTags]);

  if (posts.length === 0) {
    return (
      <div className={className}>
        <Text variant="body-default-s" style={{ textAlign: 'center', color: 'var(--color-neutral-medium)' }}>
          No hay artículos para mostrar estadísticas
        </Text>
      </div>
    );
  }

  return (
    <div className={className}>
      <Column fillWidth gap="16">
        {/* Estadísticas principales */}
        <Row fillWidth gap="16">
          <Card
            fillWidth
            padding="16"
            radius="l"
            background="neutral-weak"
            border="neutral-alpha-weak"
          >
            <Column gap="8">
              <Text variant="label-default-s" onBackground="neutral-medium">
                Total de artículos
              </Text>
              <Text variant="heading-strong-l">
                {statistics.totalPosts}
              </Text>
            </Column>
          </Card>

          <Card
            fillWidth
            padding="16"
            radius="l"
            background="neutral-weak"
            border="neutral-alpha-weak"
          >
            <Column gap="8">
              <Text variant="label-default-s" onBackground="neutral-medium">
                Etiquetas únicas
              </Text>
              <Text variant="heading-strong-l">
                {statistics.uniqueTags}
              </Text>
            </Column>
          </Card>
        </Row>

        {/* Tiempo de lectura */}
        <Card
          fillWidth
          padding="16"
          radius="l"
          background="neutral-weak"
          border="neutral-alpha-weak"
        >
          <Column gap="12">
            <Row fillWidth align="center" gap="8">
              <Text variant="label-default-m" onBackground="neutral-medium">
                Tiempo total de lectura
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                ~{statistics.totalReadingTime} min
              </Text>
            </Row>

            <Row fillWidth align="center" gap="8">
              <Text variant="label-default-s" onBackground="neutral-medium">
                Tiempo promedio por artículo
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {statistics.averageReadingTime} min
              </Text>
            </Row>
          </Column>
        </Card>

        {/* Top etiquetas */}
        {showTopTags && statistics.topTags.length > 0 && (
          <Card
            fillWidth
            padding="16"
            radius="l"
            background="neutral-weak"
            border="neutral-alpha-weak"
          >
            <Column gap="12">
              <Text variant="label-default-m" onBackground="neutral-medium">
                Etiquetas más populares
              </Text>

              <Column gap="8">
                {statistics.topTags.map((tagInfo, index) => (
                  <Row key={tagInfo.tag} fillWidth align="center" gap="12">
                    <Text
                      variant="label-default-s"
                      style={{
                        minWidth: '20px',
                        color: 'var(--color-neutral-medium)'
                      }}
                    >
                      #{index + 1}
                    </Text>

                    <Text variant="label-default-s" style={{ flex: 1 }}>
                      {tagInfo.tag}
                    </Text>

                    <Row gap="8" align="center" style={{ minWidth: '80px' }}>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {tagInfo.count}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {tagInfo.percentage}%
                      </Text>
                    </Row>

                    <div style={{ flex: 1, maxWidth: '120px', height: '4px', backgroundColor: 'var(--color-neutral-alpha-weak)', borderRadius: '2px' }}>
                      <div style={{
                        width: `${tagInfo.percentage}%`,
                        height: '100%',
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </Row>
                ))}
              </Column>
            </Column>
          </Card>
        )}
      </Column>
    </div>
  );
}

export default BlogStats;
