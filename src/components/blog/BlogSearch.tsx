"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Input, Row, Text, Icon } from "@once-ui-system/core";
import { SearchFilters } from "@/types/blog-utils.types";
import { PostType } from "@/components/blog/Posts";

interface BlogSearchProps {
  posts: PostType[];
  onSearch: (filteredPosts: PostType[]) => void;
  placeholder?: string;
  className?: string;
}

export function BlogSearch({
  posts,
  onSearch,
  placeholder = "Buscar artículos...",
  className
}: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Función de búsqueda
  const performSearch = useCallback((query: string, postsToSearch: PostType[]): PostType[] => {
    if (!query.trim()) {
      return postsToSearch;
    }

    const searchTerm = query.toLowerCase().trim();

    return postsToSearch.filter((post) => {
      const title = post.metadata.title?.toLowerCase() || "";
      const summary = post.metadata.summary?.toLowerCase() || "";
      const content = post.content?.toLowerCase() || "";

      // Buscar en título
      if (title.includes(searchTerm)) {
        return true;
      }

      // Buscar en resumen
      if (summary.includes(searchTerm)) {
        return true;
      }

      // Buscar en contenido
      if (content.includes(searchTerm)) {
        return true;
      }

      // Buscar en etiquetas
      const tags = post.metadata.tags || [];
      if (tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        return true;
      }

      // Buscar coincidencias parciales en palabras clave
      const titleWords = title.split(/\s+/);
      const summaryWords = summary.split(/\s+/);

      const hasKeywordMatch = [...titleWords, ...summaryWords].some(word =>
        word.length > 3 && searchTerm.includes(word) || word.includes(searchTerm)
      );

      return hasKeywordMatch;
    });
  }, []);

  // Realizar búsqueda cuando cambia el término
  const searchResults = useMemo(() => {
    return performSearch(debouncedQuery, posts);
  }, [debouncedQuery, posts, performSearch]);

  // Llamar al callback cuando cambian los resultados
  useEffect(() => {
    onSearch(searchResults);
  }, [searchResults, onSearch]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const hasResults = searchResults.length > 0;
  const hasActiveSearch = debouncedQuery.trim().length > 0;

  return (
    <div className={className}>
      <Row fillWidth gap="8" align="center">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          fillWidth
          prefix={
            <Icon name="search" size="s" />
          }
          suffix={
            hasActiveSearch ? (
              <button
                onClick={handleClearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Limpiar búsqueda"
              >
                <Icon name="close" size="xs" />
              </button>
            ) : undefined
          }
          style={{
            '--input-border-color': 'var(--color-neutral-alpha-weak)',
            '--input-focus-border-color': 'var(--color-primary)',
          } as React.CSSProperties}
        />
      </Row>

      {/* Feedback visual del término de búsqueda */}
      {hasActiveSearch && (
        <Row fillWidth gap="8" marginTop="8" align="center">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Buscando "{debouncedQuery}"
          </Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
          </Text>
        </Row>
      )}

      {/* Mensaje cuando no hay resultados */}
      {hasActiveSearch && !hasResults && (
        <Row fillWidth marginTop="8">
          <Text variant="body-default-s" style={{ color: 'var(--color-neutral-medium)' }}>
            No se encontraron artículos que coincidan con "{debouncedQuery}"
          </Text>
        </Row>
      )}
    </div>
  );
}

export default BlogSearch;
