import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['owner-restaurants'],
    queryFn: async () => {
      const { data } = await api.get('/restaurants');
      return data;
    },
  });
};

export const useCategories = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['owner-categories', restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/restaurants/${restaurantId}/categories`);
      return data;
    },
    enabled: !!restaurantId,
  });
};

export const useMenu = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['owner-menu', restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/restaurants/${restaurantId}/menu`);
      return data;
    },
    enabled: !!restaurantId,
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, availability }: { itemId: string, availability: boolean }) => {
      const { data } = await api.patch(`/menu-items/${itemId}/availability`, { availability });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-menu'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryId: string) => {
      await api.delete(`/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-categories'] });
      queryClient.invalidateQueries({ queryKey: ['owner-menu'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/menu-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-menu'] });
    },
  });
};
