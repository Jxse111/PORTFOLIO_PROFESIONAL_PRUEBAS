{{ ... }}

import { useState, useMemo } from "react";
import { Column, Heading, Text, Flex } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import Posts from "@/components/blog/Posts";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { baseURL, blog, person } from "@/resources";

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
      
      {/* Filtros (categoría + tiempo) */}
      <Flex direction="column" gap="16" marginBottom="24" style={{ width: "100%", flexWrap: "wrap" }}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <TimeFilter
          selectedTimeFilter={selectedTimeFilter}
          onTimeFilterChange={setSelectedTimeFilter}
        />
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
          <Text variant="body-default-m" style={{ textAlign: 'center', padding: '2rem 0' }}>
            No se encontraron publicaciones con los filtros seleccionados.
          </Text>
        )}
      </Column>
    </Column>
  );
}
