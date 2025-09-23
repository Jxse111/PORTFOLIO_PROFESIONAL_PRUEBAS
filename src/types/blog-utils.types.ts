// Tipo base para Post
export interface PostType {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
    image?: string;
    tags?: string[];
    // Propiedades adicionales que podrían estar presentes
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
  content: string;
}

// Tipos para BlogSearch
export interface BlogSearchProps {
  posts: PostType[];
  onSearch: (filteredPosts: PostType[]) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchFilters {
  query: string;
  tags: string[];
}

// Tipos para BlogSort
export interface BlogSortProps {
  posts: PostType[];
  onSort: (sortedPosts: PostType[]) => void;
  defaultSort?: SortOption;
  className?: string;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'reverse-alphabetical';

export interface SortConfig {
  option: SortOption;
  label: string;
}

// Tipos para BlogStats
export interface BlogStatsProps {
  posts: PostType[];
  className?: string;
  showTopTags?: boolean;
  maxTopTags?: number;
}

export interface BlogStatistics {
  totalPosts: number;
  uniqueTags: number;
  totalReadingTime: number;
  topTags: Array<{ tag: string; count: number; percentage: number }>;
  averageReadingTime: number;
}

// Tipos para ReadingProgress
export interface ReadingProgressProps {
  content: string;
  className?: string;
  showTimeRemaining?: boolean;
  wordsPerMinute?: number;
}

export interface ReadingState {
  progress: number;
  timeElapsed: number;
  timeRemaining: number;
  totalTime: number;
}

// Tipos para RelatedPosts
export interface RelatedPostsProps {
  currentPost: PostType;
  allPosts: PostType[];
  maxRelated?: number;
  className?: string;
  showFallback?: boolean;
}

export interface RelatedPostScore {
  post: PostType;
  score: number;
  reason: 'tags' | 'recent' | 'random';
}

// Tipos para EnhancedBlogManager
export interface BlogManagerFilters {
  search: string;
  tags: string[];
  sort: SortOption;
  showStats: boolean;
}

export interface EnhancedBlogManagerProps {
  initialPosts: PostType[];
  showSearch?: boolean;
  showSort?: boolean;
  showStats?: boolean;
  showReadingProgress?: boolean;
  defaultFilters?: Partial<BlogManagerFilters>;
  className?: string;
  onFiltersChange?: (filters: BlogManagerFilters) => void;
  enableRelatedPosts?: boolean;
  maxRelatedPosts?: number;
}

// Tipos utilitarios
export interface BlogUtilityHook<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface BlogHookOptions {
  debounceMs?: number;
  minSearchLength?: number;
  cacheResults?: boolean;
}
