import { useStripe as useNativeStripe } from '@stripe/stripe-react-native';

export const useStripe = () => {
  return useNativeStripe();
};
