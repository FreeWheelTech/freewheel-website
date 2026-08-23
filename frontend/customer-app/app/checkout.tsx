import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../src/hooks/useCart';
import { useCreateOrder } from '../src/hooks/useOrders';
import { useCreatePayment, useVerifyPayment } from '../src/hooks/usePayments';
import { useAuth } from '../src/context/AuthContext';
import { useStripe } from '@stripe/stripe-react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const createPayment = useCreatePayment();
  const verifyPayment = useVerifyPayment();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [isProcessing, setIsProcessing] = useState(false);

  if (isCartLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Your cart is empty.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePayment = async (orderId: string) => {
    try {
      // 1. Initialize Payment
      const paymentData = await createPayment.mutateAsync(orderId);
      if (!paymentData.clientSecret) throw new Error('Missing client secret');

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'BYTE++ Food',
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}><Text style={[styles.headerBack, isLoading && {color: '#ccc'}]}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{width: 40}} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.items.map((item: any) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryItemName}>
                {item.quantity} × {item.menuItem.name}
              </Text>
              <Text style={styles.summaryItemPrice}>₹{item.lineTotal}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₹{cart.subtotal}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.infoText}>Name: {user?.name}</Text>
          <Text style={styles.infoText}>Email: {user?.email}</Text>
          <Text style={styles.infoNote}>* Secure payment powered by Stripe (Test Mode).</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Order Total</Text>
          <Text style={styles.totalValue}>₹{cart.subtotal}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.placeOrderBtn, isLoading && styles.placeOrderBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.placeOrderText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerBack: { fontSize: 16, color: '#333' },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItemName: { fontSize: 16, color: '#333' },
  summaryItemPrice: { fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, color: 'gray' },
  totalValue: { fontSize: 22, fontWeight: 'bold' },
  infoText: { fontSize: 16, color: '#333', marginBottom: 5 },
  infoNote: { fontSize: 14, color: '#0066cc', marginTop: 10, fontStyle: 'italic', fontWeight: '500' },
  footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#ddd' },
  placeOrderBtn: { backgroundColor: '#FFD700', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  placeOrderBtnDisabled: { opacity: 0.7 },
  placeOrderText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  backButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  backText: { fontWeight: 'bold' },
});
