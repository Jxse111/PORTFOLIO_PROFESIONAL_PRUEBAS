export { default as BlogFilters } from './BlogFilters';
export { default as Post } from './Post';
export { default as Posts } from './Posts';
export { default as ShareSection } from './ShareSection';

// Nuevas utilidades del blog
export { default as BlogSearch } from './BlogSearch';
export { default as BlogSort } from './BlogSort';
export { default as BlogStats } from './BlogStats';
export { default as ReadingProgress } from './ReadingProgress';
export { default as RelatedPosts } from './RelatedPosts';
export { default as EnhancedBlogManager } from './EnhancedBlogManager';

// Re-exportar las funciones para mantener compatibilidad
export { BlogSearch as Search } from './BlogSearch';
export { BlogSort as Sort } from './BlogSort';
export { BlogStats as Stats } from './BlogStats';
export { ReadingProgress as Progress } from './ReadingProgress';
export { RelatedPosts as Related } from './RelatedPosts';
export { EnhancedBlogManager as Manager } from './EnhancedBlogManager';
