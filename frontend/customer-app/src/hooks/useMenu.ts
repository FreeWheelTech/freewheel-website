import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useRestaurants = (searchQuery: string = '') => {
  return useInfiniteQuery({
    queryKey: ['restaurants', searchQuery],
    queryFn: async ({ pageParam = undefined }) => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (pageParam) params.append('cursor', pageParam);

      const { data } = await api.get(`/restaurants?${params.toString()}`);
      return data; // { data: items, nextCursor }
    },
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
};

export const useCategories = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/restaurants/${restaurantId}/categories`);
      return data;
    },
    enabled: !!restaurantId,
  });
};

export const useMenu = (restaurantId: string | undefined, category?: string, search?: string) => {
  return useInfiniteQuery({
    queryKey: ['menu', restaurantId, category, search],
    queryFn: async ({ pageParam = undefined }) => {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search) params.append('q', search);
      if (pageParam) params.append('cursor', pageParam);
      
      const { data } = await api.get(`/restaurants/${restaurantId}/menu?${params.toString()}`);
      return data; // { data: items, nextCursor }
    },
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    enabled: !!restaurantId,
    initialPageParam: undefined,
  });
};

export interface GlobalSearchFilters {
  q: string;
  category: string;
  minPrice?: string;
  maxPrice?: string;
  dietaryType?: string;
  sort?: string;
}

export const useGlobalMenuSearch = (filters: GlobalSearchFilters) => {
  return useInfiniteQuery({
    queryKey: ['globalMenuSearch', filters],
    queryFn: async ({ pageParam = undefined }) => {
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.dietaryType) params.append('dietaryType', filters.dietaryType);
      if (filters.sort) params.append('sort', filters.sort);
      if (pageParam) params.append('cursor', pageParam);

      const { data } = await api.get(`/menu/search?${params.toString()}`);
      return data;
    },
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
};

export const useMenuItem = (itemId: string | undefined) => {
  return useQuery({
    queryKey: ['menuItem', itemId],
    queryFn: async () => {
      const { data } = await api.get(`/menu-items/${itemId}`);
      return data;
    },
    enabled: !!itemId,
  });
};
