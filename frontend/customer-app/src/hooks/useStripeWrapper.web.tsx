export const useStripe = () => {
  return {
    initPaymentSheet: async () => {
      console.log('Stripe initPaymentSheet called on web (mocked)');
      return { error: null };
    },
    presentPaymentSheet: async () => {
      console.log('Stripe presentPaymentSheet called on web (mocked)');
      return { error: { message: 'Stripe payments are not supported on web in this demo' } };
    }
  };
};
