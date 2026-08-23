import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.post('/payments/create', { orderId });
      return data; // returns { clientSecret }
    }
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.post('/payments/verify', { orderId });
      return data; // returns { success, status, payment }
    }
  });
}
