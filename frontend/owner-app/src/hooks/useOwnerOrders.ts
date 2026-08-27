import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useOwnerOrders() {
  return useQuery({
    queryKey: ['owner-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/owner');
      return data;
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useOwnerOrder(id: string) {
  return useQuery({
    queryKey: ['owner-order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/owner/${id}`);
      return data;
    },
    enabled: !!id,
    refetchInterval: 10000, // Poll single order too
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      const { data } = await api.patch(`/orders/owner/${orderId}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['owner-orders'] });
      queryClient.invalidateQueries({ queryKey: ['owner-order', variables.orderId] });
    },
  });
}
