import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../src/hooks/useCart';
import { useCreateOrder } from '../src/hooks/useOrders';
import { useCreatePayment, useVerifyPayment } from '../src/hooks/usePayments';
import { useAuth } from '../src/context/AuthContext';
import { useStripe } from '../src/hooks/useStripeWrapper';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';

export default function CheckoutScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const createPayment = useCreatePayment();
  const verifyPayment = useVerifyPayment();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [isProcessing, setIsProcessing] = useState(false);

  if (isCartLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Your cart is empty.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handlePayment = async (orderId: string) => {
    try {
      // 1. Initialize Payment
      const paymentData = await createPayment.mutateAsync(orderId);
      if (!paymentData.clientSecret) throw new Error('Missing client secret');

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'BYTE CAFE',
        paymentIntentClientSecret: paymentData.clientSecret,
        returnURL: 'bytefood://stripe-redirect',
      });

      if (initError) throw new Error(initError.message);

      // 2. Present Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === 'Canceled') {
          Alert.alert('Payment Cancelled', 'You cancelled the payment. You can retry later from your orders.');
          router.replace(`/order/${orderId}` as any); // Order is PENDING
          return;
        }
        throw new Error(presentError.message);
      }

      // 3. Verify Payment
      const verification = await verifyPayment.mutateAsync(orderId);
      if (verification.success) {
        Alert.alert('Success', 'Payment completed successfully!');
        router.replace(`/order/${orderId}` as any);
      } else {
        Alert.alert('Verification Pending', 'Payment is processing. Check your orders later.');
        router.replace(`/order/${orderId}` as any);
      }

    } catch (error: any) {
      Alert.alert('Payment Error', error.message || 'An error occurred during payment');
      router.replace(`/order/${orderId}` as any); // Redirect to order details to allow retry
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    createOrder.mutate(undefined, {
      onSuccess: (orderData) => {
        handlePayment(orderData.id);
      },
      onError: (error: any) => {
        setIsProcessing(false);
        const msg = error.response?.data?.message || 'Failed to place order';
        Alert.alert('Checkout Error', Array.isArray(msg) ? msg.join(', ') : msg);
      }
    });
  };

  const isLoading = createOrder.isPending || isProcessing;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={isLoading}>
          <Text style={{ fontSize: 24, color: isLoading ? theme.textSecondary : theme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Summary</Text>
          {cart.items.map((item: any) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={[styles.summaryItemName, { color: theme.textSecondary }]}>
                {item.quantity} × {item.menuItem.name}
              </Text>
              <Text style={[styles.summaryItemPrice, { color: theme.text }]}>₹{item.lineTotal}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.totalValue, { color: theme.text }]}>₹{cart.subtotal}</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Customer Information</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>Name: {user?.name}</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>Email: {user?.email}</Text>
          
          <View style={[styles.infoNoteBox, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.infoNote, { color: theme.textSecondary }]}>
              🔒 Secure payment powered by Stripe (Test Mode).
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Order Total</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>₹{cart.subtotal}</Text>
        </View>
        <Button 
          title="Pay Now" 
          onPress={handlePlaceOrder}
          isLoading={isLoading}
          size="large"
          style={{ marginTop: 16 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1, 
  },
  backButton: { width: 40 },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1 },
  scrollContent: { padding: 20 },
  section: { 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 20, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryItemName: { fontSize: 16, fontWeight: '500' },
  summaryItemPrice: { fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, marginVertical: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18 },
  totalValue: { fontSize: 22, fontWeight: 'bold' },
  infoText: { fontSize: 16, marginBottom: 8 },
  infoNoteBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  infoNote: { fontSize: 14, fontWeight: '500' },
  footer: { 
    padding: 24, 
    borderTopWidth: 1, 
    paddingBottom: 40,
  },
  errorText: { fontSize: 18, marginBottom: 16 },
});
