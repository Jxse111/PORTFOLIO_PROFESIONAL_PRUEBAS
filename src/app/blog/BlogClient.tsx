"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Column, Heading, Text, Flex } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import Posts from "@/components/blog/Posts";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { TimeFilter } from "@/components/blog/TimeFilter";
import { blog } from "@/resources";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "../../components/blog/BlogFilters.module.css";

export type Post = {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
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

interface BlogClientProps {
  initialPosts: Post[];
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  // Estado de filtros (dropdowns)
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>("newest");

  // Sincronizar filtros con la URL para que sean compartibles y persistentes
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Leer filtros desde la URL al cargar / cambiar los params
  useEffect(() => {
    const cat = searchParams?.get("category") || "";
    const sort = searchParams?.get("sort") || "newest";
    setSelectedCategory(cat);
    setSelectedTimeFilter(sort);
  }, [searchParams]);

  // Helper para actualizar query params sin recargar la página
  const updateQueryParams = useCallback(
    (category: string, sort: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (category) params.set("category", category);
      else params.delete("category");

      if (sort && sort !== "newest") params.set("sort", sort);
      else params.delete("sort");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Usar los posts iniciales del servidor
  const allPosts = useMemo(() => initialPosts, [initialPosts]);

  // Categorías únicas basadas en tags
  const categories = useMemo<string[]>(() => {
    const set = new Set<string>();
    for (const post of allPosts) {
      const postTags = post.metadata.tags || [];
      for (const t of postTags) if (t) set.add(t);
    }
    return Array.from(set).sort();
  }, [allPosts]);

  // Filtrado por categoría y ordenación por tiempo
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = allPosts;
    if (selectedCategory) {
      filtered = allPosts.filter((post) => {
        const postTags = post.metadata.tags || [];
        return postTags.includes(selectedCategory);
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.metadata.publishedAt).getTime();
      const dateB = new Date(b.metadata.publishedAt).getTime();
      switch (selectedTimeFilter) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "last-updated":
          // Si en el futuro hay "updatedAt", usarla. Por ahora, publishedAt
          return dateB - dateA;
        default:
          return dateB - dateA;
      }
    });
    return sorted;
  }, [allPosts, selectedCategory, selectedTimeFilter]);

  // Agrupar posts por categoría para mostrar en secciones
  const featuredPosts = filteredAndSortedPosts.slice(0, 1);
  const secondaryPosts = filteredAndSortedPosts.slice(1, 3);
  const morePosts = filteredAndSortedPosts.slice(3);

  return (
    <Column maxWidth="m" paddingTop="24">
      <Heading marginBottom="16" variant="heading-strong-xl">
        {blog.title}
      </Heading>
      
      {/* Barra de filtros (categoría + tiempo + limpiar + contador) */}
      <Flex direction="row" gap="16" marginBottom="24" className={styles.blogFilters}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(value) => {
            setSelectedCategory(value);
            updateQueryParams(value, selectedTimeFilter);
          }}
        />
        <TimeFilter
          selectedTimeFilter={selectedTimeFilter}
          onTimeFilterChange={(value) => {
            setSelectedTimeFilter(value);
            updateQueryParams(selectedCategory, value);
          }}
        />
        {/* Botón limpiar filtros */}
        {(selectedCategory || selectedTimeFilter !== "newest") && (
          <button
            type="button"
            aria-label="Limpiar filtros"
            onClick={() => {
              setSelectedCategory("");
              setSelectedTimeFilter("newest");
              updateQueryParams("", "newest");
            }}
            className={styles.clearButton}
          >
            <span className={styles.buttonContent}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Limpiar filtros</span>
            </span>
          </button>
        )}
        <div className={styles.spacer} />
        {/* Contador de resultados */}
        <Text variant="label-default-m">
          {filteredAndSortedPosts.length} resultado{filteredAndSortedPosts.length !== 1 ? "s" : ""}
        </Text>
      </Flex>

      <Column fillWidth flex={1} gap="40">
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
        
        <Mailchimp marginBottom="l" />
        
        {/* Más posts */}
        {morePosts.length > 0 && (
          <>
            <Heading as="h2" variant="heading-strong-xl">
              Más publicaciones
            </Heading>
            <Posts 
              posts={morePosts} 
              columns="2" 
            />
          </>
        )}
        
        {/* Mensaje cuando no hay resultados */}
        {filteredAndSortedPosts.length === 0 && (
          <Text variant="body-default-m" className={styles.emptyMessage}>
            No se encontraron publicaciones con los filtros seleccionados.
          </Text>
        )}
      </Column>
    </Column>
  );
}
