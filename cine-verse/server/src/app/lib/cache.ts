import NodeCache from 'node-cache';

// Create cache instances with different TTLs
export const movieCache = new NodeCache({
  stdTTL: 300, // 5 minutes for movie data
  checkperiod: 60, // Check for expired keys every minute
  useClones: false, // Better performance
});

export const featuredCache = new NodeCache({
  stdTTL: 600, // 10 minutes for featured movies
  checkperiod: 120,
  useClones: false,
});

export const searchCache = new NodeCache({
  stdTTL: 180, // 3 minutes for search results
  checkperiod: 60,
  useClones: false,
});

// Cache helper functions
export const getCachedData = <T>(cache: NodeCache, key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCachedData = <T>(cache: NodeCache, key: string, data: T, ttl?: number): boolean => {
  return ttl !== undefined ? cache.set(key, data, ttl) : cache.set(key, data);
};

export const invalidateCache = (cache: NodeCache, pattern: string): void => {
  const keys = cache.keys();
  keys.forEach((key: string) => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};

// Invalidate all movie-related caches when data changes
export const invalidateMovieCaches = (movieId?: string): void => {
  invalidateCache(movieCache, movieId || '');
  featuredCache.flushAll();
  searchCache.flushAll();
};
