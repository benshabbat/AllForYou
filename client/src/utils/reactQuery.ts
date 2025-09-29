import { QueryClient, QueryKey, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '../types/common';

// Enhanced query client with advanced caching
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep unused data for 10 minutes  
        gcTime: 10 * 60 * 1000,
        // Retry failed requests 3 times with exponential backoff
        retry: (failureCount: number, error: any) => {
          if (error?.status === 404 || error?.status === 403) {
            return false; // Don't retry for these errors
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Background refetch settings
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        // Network mode settings
        networkMode: 'offlineFirst',
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        retryDelay: 2000,
        networkMode: 'offlineFirst',
      },
    },
  });
};

// Query key factory for consistent cache keys
export const queryKeys = {
  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: (id: string) => [...queryKeys.users.all, 'profile', id] as const,
    favorites: (id: string) => [...queryKeys.users.all, 'favorites', id] as const,
  },

  // Recipe queries
  recipes: {
    all: ['recipes'] as const,
    lists: () => [...queryKeys.recipes.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.recipes.lists(), filters] as const,
    details: () => [...queryKeys.recipes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.recipes.details(), id] as const,
    search: (query: string) => [...queryKeys.recipes.all, 'search', query] as const,
    byUser: (userId: string) => [...queryKeys.recipes.all, 'user', userId] as const,
    byCategory: (category: string) => [...queryKeys.recipes.all, 'category', category] as const,
    nutrition: (id: string) => [...queryKeys.recipes.all, 'nutrition', id] as const,
  },

  // Allergen queries
  allergens: {
    all: ['allergens'] as const,
    lists: () => [...queryKeys.allergens.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.allergens.lists(), filters] as const,
    details: () => [...queryKeys.allergens.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.allergens.details(), id] as const,
    userAllergens: (userId: string) => [...queryKeys.allergens.all, 'user', userId] as const,
  },

  // Forum queries
  forum: {
    all: ['forum'] as const,
  },
} as const;

// Add forum sub-queries after the main object is defined
(queryKeys as any).forum.topics = {
  all: [...queryKeys.forum.all, 'topics'] as const,
  list: (filters: Record<string, any>) => [...(queryKeys as any).forum.topics.all, filters] as const,
  detail: (id: string) => [...(queryKeys as any).forum.topics.all, id] as const,
  comments: (id: string) => [...(queryKeys as any).forum.topics.all, id, 'comments'] as const,
};

(queryKeys as any).forum.posts = {
  all: [...queryKeys.forum.all, 'posts'] as const,
  list: (filters: Record<string, any>) => [...(queryKeys as any).forum.posts.all, filters] as const,
  detail: (id: string) => [...(queryKeys as any).forum.posts.all, id] as const,
  byUser: (userId: string) => [...(queryKeys as any).forum.posts.all, 'user', userId] as const,
};

// Product/Scanner queries
(queryKeys as any).products = {
  all: ['products'] as const,
  scan: (barcode: string) => [...(queryKeys as any).products.all, 'scan', barcode] as const,
  search: (query: string) => [...(queryKeys as any).products.all, 'search', query] as const,
  detail: (id: string) => [...(queryKeys as any).products.all, 'detail', id] as const,
};

// Cache invalidation utilities
export const cacheUtils = {
  // Invalidate all user-related data
  invalidateUser: (queryClient: QueryClient, userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.favorites(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.byUser(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.allergens.userAllergens(userId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    }
  },

  // Invalidate recipe-related data
  invalidateRecipes: (queryClient: QueryClient, recipeId?: string) => {
    if (recipeId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.detail(recipeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.nutrition(recipeId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    }
    // Also invalidate user favorites that might contain this recipe
    queryClient.invalidateQueries({ queryKey: ['users', 'favorites'] });
  },

  // Invalidate forum data
  invalidateForum: (queryClient: QueryClient, topicId?: string) => {
    if (topicId) {
      queryClient.invalidateQueries({ queryKey: [(queryKeys as any).forum.topics.detail(topicId)] });
      queryClient.invalidateQueries({ queryKey: [(queryKeys as any).forum.topics.comments(topicId)] });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.all });
    }
  },

  // Prefetch related data
  prefetchRelated: async (queryClient: QueryClient, type: string, id: string) => {
    switch (type) {
      case 'recipe':
        // When viewing a recipe, prefetch nutrition info
        await queryClient.prefetchQuery({
          queryKey: queryKeys.recipes.nutrition(id),
          queryFn: () => fetch(`/api/recipes/${id}/nutrition`).then(res => res.json()),
          staleTime: 15 * 60 * 1000, // 15 minutes
        });
        break;
      
      case 'user':
        // When viewing a user profile, prefetch their recipes
        await queryClient.prefetchQuery({
          queryKey: queryKeys.recipes.byUser(id),
          queryFn: () => fetch(`/api/users/${id}/recipes`).then(res => res.json()),
          staleTime: 10 * 60 * 1000, // 10 minutes
        });
        break;
    }
  },
};

// Optimistic updates utility
export const optimisticUpdates = {
  // Add recipe to favorites
  addToFavorites: (queryClient: QueryClient, userId: string, recipe: any) => {
    queryClient.setQueryData(
      queryKeys.users.favorites(userId),
      (oldData: any[] = []) => [...oldData, recipe]
    );
  },

  // Remove recipe from favorites
  removeFromFavorites: (queryClient: QueryClient, userId: string, recipeId: string) => {
    queryClient.setQueryData(
      queryKeys.users.favorites(userId),
      (oldData: any[] = []) => oldData.filter(recipe => recipe.id !== recipeId)
    );
  },

  // Update recipe rating
  updateRecipeRating: (queryClient: QueryClient, recipeId: string, newRating: number) => {
    queryClient.setQueryData(
      queryKeys.recipes.detail(recipeId),
      (oldData: any) => oldData ? { ...oldData, rating: newRating } : oldData
    );
  },

  // Add forum comment
  addForumComment: (queryClient: QueryClient, topicId: string, comment: any) => {
    queryClient.setQueryData(
      (queryKeys as any).forum.topics.comments(topicId),
      (oldData: any[] = []) => [...oldData, comment]
    );
  },
};

// Background sync utilities
export const backgroundSync = {
  // Sync user data in background
  syncUserData: async (queryClient: QueryClient, userId: string) => {
    try {
      await queryClient.refetchQueries({
        queryKey: queryKeys.users.profile(userId),
        type: 'active',
      });
      await queryClient.refetchQueries({
        queryKey: queryKeys.users.favorites(userId),
        type: 'active',
      });
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  },

  // Sync recipe data
  syncRecipeData: async (queryClient: QueryClient, recipeId?: string) => {
    try {
      if (recipeId) {
        await queryClient.refetchQueries({
          queryKey: queryKeys.recipes.detail(recipeId),
          type: 'active',
        });
      } else {
        await queryClient.refetchQueries({
          queryKey: queryKeys.recipes.lists(),
          type: 'active',
        });
      }
    } catch (error) {
      console.error('Recipe sync failed:', error);
    }
  },
};

// Error handling for queries and mutations
export const createQueryOptions = <T = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: Partial<UseQueryOptions<T, ApiError>> = {}
): UseQueryOptions<T, ApiError> => ({
  queryKey,
  queryFn,
  ...options,
});

export const createMutationOptions = <TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: Partial<UseMutationOptions<TData, ApiError, TVariables>> = {}
): UseMutationOptions<TData, ApiError, TVariables> => ({
  mutationFn,
  onError: (error: ApiError) => {
    console.error('Mutation error:', error);
    // Global error handling for mutations
  },
  ...options,
});

// Pagination utilities
export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export const createInfiniteQueryOptions = <T = unknown>(
  queryKey: QueryKey,
  queryFn: (pageParam: number) => Promise<PaginatedData<T>>,
  options: any = {}
) => ({
  queryKey,
  queryFn: ({ pageParam = 1 }) => queryFn(pageParam),
  getNextPageParam: (lastPage: PaginatedData<T>) => 
    lastPage.hasMore ? lastPage.page + 1 : undefined,
  getPreviousPageParam: (firstPage: PaginatedData<T>) => 
    firstPage.page > 1 ? firstPage.page - 1 : undefined,
  ...options,
});

// Global cache management
export const cacheManager = {
  // Clear all cache
  clearAll: (queryClient: QueryClient) => {
    queryClient.clear();
  },

  // Clear specific domain cache
  clearDomain: (queryClient: QueryClient, domain: keyof typeof queryKeys) => {
    queryClient.removeQueries({ queryKey: queryKeys[domain].all });
  },

  // Get cache size information
  getCacheInfo: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.observers.length > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      size: JSON.stringify(cache).length,
    };
  },

  // Cleanup stale cache entries
  cleanup: (queryClient: QueryClient) => {
    queryClient.getQueryCache().clear();
    // Force garbage collection if available
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
  },
};