"use client";

import { useState, useEffect, useMemo } from "react";
import { Select, Row, Text, Icon } from "@once-ui-system/core";
import { BlogSortProps, SortOption, SortConfig } from "@/types/blog-utils.types";
import { PostType } from "@/components/blog/Posts";

const SORT_OPTIONS: SortConfig[] = [
  { option: 'newest', label: 'Más recientes' },
  { option: 'oldest', label: 'Más antiguos' },
  { option: 'alphabetical', label: 'Alfabético A-Z' },
  { option: 'reverse-alphabetical', label: 'Alfabético Z-A' },
];

export function BlogSort({
  posts,
  onSort,
  defaultSort = 'newest',
  className
}: BlogSortProps) {
  const [selectedSort, setSelectedSort] = useState<SortOption>(defaultSort);

  // Función para ordenar posts
  const sortPosts = useMemo(() => {
    return (postsToSort: PostType[], sortOption: SortOption): PostType[] => {
      const sorted = [...postsToSort];

      switch (sortOption) {
        case 'newest':
          return sorted.sort((a, b) =>
            new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
          );

        case 'oldest':
          return sorted.sort((a, b) =>
            new Date(a.metadata.publishedAt).getTime() - new Date(b.metadata.publishedAt).getTime()
          );

        case 'alphabetical':
          return sorted.sort((a, b) =>
            a.metadata.title.localeCompare(b.metadata.title, 'es', { sensitivity: 'base' })
          );

        case 'reverse-alphabetical':
          return sorted.sort((a, b) =>
            b.metadata.title.localeCompare(a.metadata.title, 'es', { sensitivity: 'base' })
          );

        default:
          return sorted;
      }
    };
  }, []);

  // Ordenar posts cuando cambia la opción de ordenación
  const sortedPosts = useMemo(() => {
    return sortPosts(posts, selectedSort);
  }, [posts, selectedSort, sortPosts]);

  // Llamar al callback cuando cambian los posts ordenados
  useEffect(() => {
    onSort(sortedPosts);
  }, [sortedPosts, onSort]);

  const currentSortConfig = SORT_OPTIONS.find(option => option.option === selectedSort);

  return (
    <div className={className}>
      <Row fillWidth gap="12" align="center">
        <label htmlFor="blog-sort" style={{ color: 'var(--color-neutral-medium)' }}>
          Ordenar por:
        </label>
        <select
          id="blog-sort"
          value={selectedSort}
          onChange={(e) => {
            const newSort = e.target.value as SortOption;
            setSelectedSort(newSort);
          }}
          style={{
            minWidth: '160px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--color-neutral-alpha-weak)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-on-background)',
            fontSize: '14px',
          }}
        >
          {SORT_OPTIONS.map((sortOption) => (
            <option key={sortOption.option} value={sortOption.option}>
              {sortOption.label}
            </option>
          ))}
        </select>

        {/* Información adicional del orden actual */}
        {currentSortConfig && (
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {posts.length} artículo{posts.length !== 1 ? 's' : ''}
          </Text>
        )}
      </Row>

      {/* Descripción de la ordenación actual */}
      {selectedSort !== 'newest' && (
        <Row fillWidth marginTop="4">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Mostrando artículos ordenados por {currentSortConfig?.label.toLowerCase()}
          </Text>
        </Row>
      )}
    </div>
  );
}

export default BlogSort;
