"use client";

import { useState, useMemo, useCallback } from "react";
import { Column, Row, Flex } from "@once-ui-system/core";
import { EnhancedBlogManagerProps, BlogManagerFilters, SortOption } from "@/types/blog-utils.types";
import { PostType } from "@/components/blog/Posts";
import BlogSearch from "./BlogSearch";
import BlogSort from "./BlogSort";
import BlogStats from "./BlogStats";
import RelatedPosts from "./RelatedPosts";
import Posts from "./Posts";

export function EnhancedBlogManager({
  initialPosts,
  showSearch = true,
  showSort = true,
  showStats = true,
  showReadingProgress = false,
  defaultFilters = {},
  className,
  onFiltersChange,
  enableRelatedPosts = false,
  maxRelatedPosts = 3
}: EnhancedBlogManagerProps) {
  // Estado de filtros
  const [filters, setFilters] = useState<BlogManagerFilters>({
    search: '',
    tags: [],
    sort: 'newest',
    showStats: true,
    ...defaultFilters
  });

  // Estado para posts filtrados
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>(initialPosts);
  const [sortedPosts, setSortedPosts] = useState<PostType[]>(initialPosts);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<BlogManagerFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  // Manejar búsqueda
  const handleSearch = useCallback((searchResults: PostType[]) => {
    setFilteredPosts(searchResults);
    updateFilters({ search: searchResults.length !== initialPosts.length ? 'búsqueda activa' : '' });
  }, [initialPosts.length, updateFilters]);

  // Manejar ordenación
  const handleSort = useCallback((sortedResults: PostType[]) => {
    setSortedPosts(sortedResults);
  }, []);

  // Posts finales después de aplicar todos los filtros
  const finalPosts = useMemo(() => {
    // Si hay búsqueda activa, usar posts filtrados por búsqueda
    // Si no, usar todos los posts iniciales para ordenar
    const postsToSort = filteredPosts.length !== initialPosts.length ? filteredPosts : initialPosts;
    return sortedPosts.length > 0 ? sortedPosts : postsToSort;
  }, [filteredPosts, sortedPosts, initialPosts]);

  // Posts destacados y secundarios
  const featuredPosts = finalPosts.slice(0, 1);
  const secondaryPosts = finalPosts.slice(1, 3);
  const morePosts = finalPosts.slice(3);

  // Extraer todas las etiquetas únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialPosts.forEach(post => {
      const postTags = post.metadata.tags || [];
      postTags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialPosts]);

  return (
    <Column fillWidth gap="32" className={className}>
      {/* Controles de filtrado */}
      {(showSearch || showSort) && (
        <Column fillWidth gap="16">
          {showSearch && (
            <BlogSearch
              posts={initialPosts}
              onSearch={handleSearch}
              placeholder="Buscar en artículos..."
            />
          )}

          {showSort && (
            <BlogSort
              posts={filteredPosts.length !== initialPosts.length ? filteredPosts : initialPosts}
              onSort={handleSort}
              defaultSort={filters.sort}
            />
          )}
        </Column>
      )}

      {/* Estadísticas */}
      {showStats && filters.showStats && (
        <BlogStats
          posts={initialPosts}
          showTopTags={true}
          maxTopTags={5}
        />
      )}

      {/* Posts del blog */}
      <Column fillWidth gap="40">
        {/* Post destacado */}
        {featuredPosts.length > 0 && (
          <Posts posts={featuredPosts} thumbnail />
        )}

        {/* Posts secundarios */}
        {secondaryPosts.length > 0 && (
          <Posts
            posts={secondaryPosts}
            columns="2"
            thumbnail
            direction="column"
          />
        )}

        {/* Más posts */}
        {morePosts.length > 0 && (
          <>
            <Column fillWidth>
              <Posts
                posts={morePosts}
                columns="2"
              />
            </Column>
          </>
        )}

        {/* Mensaje cuando no hay resultados */}
        {finalPosts.length === 0 && (
          <Column fillWidth paddingY="32">
            <Row fillWidth>
              <Column fillWidth gap="8" align="center">
                <text style={{
                  fontSize: 'var(--font-size-heading-m)',
                  color: 'var(--color-neutral-medium)',
                  textAlign: 'center'
                }}>
                  No se encontraron artículos
                </text>
                <text style={{
                  fontSize: 'var(--font-size-body-s)',
                  color: 'var(--color-neutral-weak)',
                  textAlign: 'center'
                }}>
                  {filters.search ? `con los términos de búsqueda "${filters.search}"` : 'con los filtros seleccionados'}
                </text>
              </Column>
            </Row>
          </Column>
        )}
      </Column>

      {/* Posts relacionados (si está habilitado y hay un post actual) */}
      {enableRelatedPosts && finalPosts.length > 0 && (
        <RelatedPosts
          currentPost={finalPosts[0]} // Usar el primer post como referencia
          allPosts={initialPosts}
          maxRelated={maxRelatedPosts}
        />
      )}
    </Column>
  );
}

export default EnhancedBlogManager;
