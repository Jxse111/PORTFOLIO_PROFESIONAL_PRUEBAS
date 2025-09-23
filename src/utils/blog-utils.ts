import { useState, useEffect, useCallback, useMemo } from 'react';
import { PostType } from '@/components/blog/Posts';
import { BlogUtilityHook, BlogHookOptions, SortOption } from '@/types/blog-utils.types';

// Hook para búsqueda de posts
export function useBlogSearch(
  posts: PostType[],
  options: BlogHookOptions = {}
): BlogUtilityHook<PostType[]> & { searchQuery: string; setSearchQuery: (query: string) => void } {
  const { debounceMs = 300, minSearchLength = 1 } = options;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>(posts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce del término de búsqueda
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setLoading(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Función de búsqueda
  const performSearch = useCallback((query: string, postsToSearch: PostType[]): PostType[] => {
    if (!query.trim() || query.length < minSearchLength) {
      return postsToSearch;
    }

    const searchTerm = query.toLowerCase().trim();

    return postsToSearch.filter((post) => {
      const title = post.metadata.title?.toLowerCase() || '';
      const summary = post.metadata.summary?.toLowerCase() || '';
      const content = post.content?.toLowerCase() || '';
      const tags = post.metadata.tags || [];

      return title.includes(searchTerm) ||
             summary.includes(searchTerm) ||
             content.includes(searchTerm) ||
             tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });
  }, [minSearchLength]);

  // Realizar búsqueda
  useEffect(() => {
    if (!loading) {
      try {
        const results = performSearch(debouncedQuery, posts);
        setFilteredPosts(results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      }
    }
  }, [debouncedQuery, posts, performSearch, loading]);

  const refetch = useCallback(() => {
    setSearchQuery('');
    setFilteredPosts(posts);
  }, [posts]);

  return {
    data: filteredPosts,
    loading,
    error,
    refetch,
    searchQuery,
    setSearchQuery
  };
}

// Hook para ordenación de posts
export function useBlogSort(
  posts: PostType[],
  defaultSort: SortOption = 'newest'
): BlogUtilityHook<PostType[]> & { sortOption: SortOption; setSortOption: (option: SortOption) => void } {
  const [sortOption, setSortOption] = useState<SortOption>(defaultSort);
  const [sortedPosts, setSortedPosts] = useState<PostType[]>(posts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para ordenar posts
  const sortPosts = useCallback((postsToSort: PostType[], option: SortOption): PostType[] => {
    const sorted = [...postsToSort];

    switch (option) {
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
  }, []);

  // Ordenar posts cuando cambian
  useEffect(() => {
    setLoading(true);
    try {
      const results = sortPosts(posts, sortOption);
      setSortedPosts(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la ordenación');
    } finally {
      setLoading(false);
    }
  }, [posts, sortOption, sortPosts]);

  const refetch = useCallback(() => {
    setSortedPosts(posts);
  }, [posts]);

  return {
    data: sortedPosts,
    loading,
    error,
    refetch,
    sortOption,
    setSortOption
  };
}

// Hook para estadísticas del blog
export function useBlogStats(posts: PostType[]): BlogUtilityHook<any> {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const totalPosts = posts.length;
      const uniqueTags = new Set<string>();
      let totalReadingTime = 0;
      const tagCounts = new Map<string, number>();

      posts.forEach((post) => {
        const tags = post.metadata.tags || [];
        tags.forEach(tag => {
          uniqueTags.add(tag);
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });

        const wordCount = post.content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        totalReadingTime += readingTime;
      });

      const topTags = Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count, percentage: Math.round((count / totalPosts) * 100) }))
        .sort((a, b) => b.count - a.count);

      const averageReadingTime = totalPosts > 0 ? Math.round(totalReadingTime / totalPosts) : 0;

      setStats({
        totalPosts,
        uniqueTags: uniqueTags.size,
        totalReadingTime,
        topTags,
        averageReadingTime
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculando estadísticas');
    } finally {
      setLoading(false);
    }
  }, [posts]);

  const refetch = useCallback(() => {
    setStats(null);
  }, []);

  return {
    data: stats,
    loading,
    error,
    refetch
  };
}

// Hook para posts relacionados
export function useRelatedPosts(
  currentPost: PostType | null,
  allPosts: PostType[],
  maxRelated: number = 3
): BlogUtilityHook<PostType[]> {
  const [relatedPosts, setRelatedPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPost) {
      setRelatedPosts([]);
      return;
    }

    setLoading(true);
    try {
      const currentTags = currentPost.metadata.tags || [];
      const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);

      if (otherPosts.length === 0) {
        setRelatedPosts([]);
        return;
      }

      const scoredPosts = otherPosts.map(post => {
        const postTags = post.metadata.tags || [];
        const commonTags = currentTags.filter(tag => postTags.includes(tag));
        const score = commonTags.length * 10;

        const postDate = new Date(post.metadata.publishedAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const isRecent = postDate > thirtyDaysAgo;
        const finalScore = score + (isRecent ? 5 : 0);

        return { post, score: finalScore };
      });

      const sorted = scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, maxRelated)
        .map(item => item.post);

      setRelatedPosts(sorted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo posts relacionados');
    } finally {
      setLoading(false);
    }
  }, [currentPost, allPosts, maxRelated]);

  const refetch = useCallback(() => {
    setRelatedPosts([]);
  }, []);

  return {
    data: relatedPosts,
    loading,
    error,
    refetch
  };
}
