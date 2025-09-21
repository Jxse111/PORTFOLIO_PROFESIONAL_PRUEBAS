"use client";

import { useState, useMemo } from "react";
import { Column, Heading, Text } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { baseURL, blog, person } from "@/resources";

export type Post = {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
    image?: string;
    tags?: string[];
    // Propiedades adicionales que no están en PostType pero que necesitamos
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
  content: string; // Requerido por PostType
};

interface BlogClientProps {
  initialPosts: Post[];
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Usar los posts iniciales del servidor
  const allPosts = useMemo(() => initialPosts, [initialPosts]);

  // Extraer todas las etiquetas únicas de los posts
  const allTags = useMemo<string[]>(() => {
    const tags = new Set<string>();
    
    for (const post of allPosts) {
      const postTags = post.metadata.tag;
      if (Array.isArray(postTags)) {
        for (const tag of postTags) tags.add(tag);
      } else if (typeof postTags === 'string' && postTags) {
        tags.add(postTags);
      }
    }
    
    return Array.from(tags).sort();
  }, [allPosts]);

  // Filtrar posts basados en las etiquetas seleccionadas
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return allPosts;
    
    return allPosts.filter(post => {
      const postTags = post.metadata.tag;
      if (!postTags) return false;
      
      const tagsArray = Array.isArray(postTags) ? postTags : [postTags];
      return selectedTags.some(tag => tagsArray.includes(tag));
    });
  }, [allPosts, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  // Agrupar posts por categoría para mostrar en secciones
  const featuredPosts = filteredPosts.slice(0, 1);
  const secondaryPosts = filteredPosts.slice(1, 3);
  const morePosts = filteredPosts.slice(3);

  return (
    <Column maxWidth="m" paddingTop="24">
      <Heading marginBottom="16" variant="heading-strong-xl">
        {blog.title}
      </Heading>
      
      {/* Filtros */}
      {allTags.length > 0 && (
        <BlogFilters 
          allTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearFilters={handleClearFilters}
        />
      )}

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
        {filteredPosts.length === 0 && (
          <Text variant="body-default-m" style={{ textAlign: 'center', padding: '2rem 0' }}>
            No se encontraron publicaciones con los filtros seleccionados.
          </Text>
        )}
      </Column>
    </Column>
  );
}
