import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useRestaurantReviews = (restaurantId: string) => {
  return useInfiniteQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get(`/restaurants/${restaurantId}/reviews`, {
        params: { cursor: pageParam, limit: 20 },
      });
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!restaurantId,
  });
};

export const useCreateReview = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orderId: string; rating: number; comment?: string }) => {
      const { data } = await api.post(`/restaurants/${restaurantId}/reviews`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateReview = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { reviewId: string; rating: number; comment?: string }) => {
      const { data } = await api.patch(`/reviews/${payload.reviewId}`, {
        rating: payload.rating,
        comment: payload.comment,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};

export const useDeleteReview = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { data } = await api.delete(`/reviews/${reviewId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};
