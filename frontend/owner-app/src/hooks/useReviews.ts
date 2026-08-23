import { useInfiniteQuery } from '@tanstack/react-query';
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
