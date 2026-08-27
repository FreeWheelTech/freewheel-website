import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, TextInput as RNTextInput, Modal, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrderDetails } from '../../src/hooks/useOrders';
import { useCreateReview, useUpdateReview, useDeleteReview } from '../../src/hooks/useReviews';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { data: order, isLoading, isError } = useOrderDetails(id);
  
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const createReview = useCreateReview(order?.restaurantId || '');
  const updateReview = useUpdateReview(order?.restaurantId || '');
  const deleteReview = useDeleteReview(order?.restaurantId || '');

  const openReviewModal = (existingReview?: any) => {
    if (existingReview) {
      setEditingReviewId(existingReview.id);
      setRating(existingReview.rating);
      setComment(existingReview.comment || '');
    } else {
      setEditingReviewId(null);
      setRating(0);
      setComment('');
    }
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = () => {
    if (rating < 1 || rating > 5) return Alert.alert('Error', 'Please select a valid rating between 1 and 5 stars.');
    
    if (editingReviewId) {
      updateReview.mutate({ reviewId: editingReviewId, rating, comment }, {
        onSuccess: () => setReviewModalVisible(false),
      });
    } else {
      createReview.mutate({ orderId: id, rating, comment }, {
        onSuccess: () => setReviewModalVisible(false),
      });
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReview.mutate(reviewId) }
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Unable to load order</Text>
        <Button title="Go Home" onPress={() => router.push('/')} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.successBanner, { backgroundColor: theme.success + '20' }]}>
          <Text style={[styles.successText, { color: theme.success }]}>Order {order.status}!</Text>
          <Text style={[styles.orderId, { color: theme.textSecondary }]}>ID: {order.id}</Text>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>{new Date(order.createdAt).toLocaleString()}</Text>
          {order.payment && (
            <View style={[styles.paymentBadge, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.paymentBadgeText, { color: theme.text }]}>Payment: {order.payment.status}</Text>
              {order.payment.providerPaymentId && <Text style={[styles.paymentIdText, { color: theme.textSecondary }]}>Ref: {order.payment.providerPaymentId}</Text>}
            </View>
          )}
          {!order.payment || order.payment.status !== 'SUCCESS' ? (
             <Button style={{ marginTop: 16 }} title="Complete Payment" onPress={() => router.push('/checkout')} />
          ) : null}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{order.restaurant.name}</Text>
          {order.items.map((item: any) => (
            <View key={item.id} style={styles.itemRow}>
              <View>
                <Text style={[styles.itemName, { color: theme.text }]}>{item.quantity} × {item.nameSnapshot}</Text>
                {item.addons.map((a: any) => (
                  <Text key={a.id} style={[styles.addonText, { color: theme.textSecondary }]}>+ {a.nameSnapshot} (₹{a.priceSnapshot})</Text>
                ))}
              </View>
              <Text style={[styles.itemPrice, { color: theme.text }]}>₹{item.lineTotal}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: theme.text }]}>₹{order.total}</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Status History</Text>
          {order.statusHistory.map((history: any, index: number) => (
            <View key={history.id} style={styles.historyRow}>
              <Text style={[styles.historyStatus, { color: theme.text }]}>{history.newStatus}</Text>
              <Text style={[styles.historyTime, { color: theme.textSecondary }]}>{new Date(history.timestamp).toLocaleTimeString()}</Text>
            </View>
          ))}
        </View>

        {order.status === 'COMPLETED' && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Reviews & Ratings</Text>
            {order.reviews && order.reviews.length > 0 ? (
              <View style={[styles.existingReview, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.myReviewLabel, { color: theme.textSecondary }]}>Your Review</Text>
                <Text style={[styles.stars, { color: theme.accent }]}>{'★'.repeat(order.reviews[0].rating)}{'☆'.repeat(5 - order.reviews[0].rating)}</Text>
                {order.reviews[0].comment ? <Text style={[styles.reviewComment, { color: theme.text }]}>{order.reviews[0].comment}</Text> : null}
                <View style={styles.reviewActions}>
                  <TouchableOpacity onPress={() => openReviewModal(order.reviews[0])}><Text style={[styles.editAction, { color: theme.accent }]}>Edit</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteReview(order.reviews[0].id)}><Text style={[styles.deleteAction, { color: theme.error }]}>Delete</Text></TouchableOpacity>
                </View>
              </View>
            ) : (
              <Button title="Rate your order" onPress={() => openReviewModal()} />
            )}
          </View>
        )}

      </ScrollView>

      <Modal visible={isReviewModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{editingReviewId ? 'Edit Review' : 'Rate Your Order'}</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[styles.starInteractive, rating >= star ? { color: theme.accent } : { color: theme.border }]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <RNTextInput
              style={[styles.commentInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.backgroundElement }]}
              placeholderTextColor={theme.textSecondary}
              placeholder="Write your review... (optional)"
              multiline
              maxLength={500}
              value={comment}
              onChangeText={setComment}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.backgroundElement }]} onPress={() => setReviewModalVisible(false)}>
                <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalSubmit, { backgroundColor: theme.accent }, rating === 0 && { opacity: 0.5 }]} 
                onPress={handleReviewSubmit}
                disabled={rating === 0 || createReview.isPending || updateReview.isPending}
              >
                <Text style={styles.submitText}>
                  {createReview.isPending || updateReview.isPending ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  content: { flex: 1, padding: 15 },
  successBanner: { padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 15 },
  successText: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  orderId: { fontSize: 14, marginBottom: 5 },
  dateText: { fontSize: 14 },
  section: { padding: 16, borderRadius: 16, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  addonText: { fontSize: 14, marginLeft: 15, marginTop: 2 },
  divider: { height: 1, marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18 },
  totalValue: { fontSize: 22, fontWeight: 'bold' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  historyStatus: { fontSize: 16, fontWeight: 'bold' },
  historyTime: { fontSize: 14 },
  errorText: { fontSize: 18, marginBottom: 16 },
  paymentBadge: { marginTop: 10, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  paymentBadgeText: { fontWeight: 'bold' },
  paymentIdText: { fontSize: 10, marginTop: 2 },
  existingReview: { padding: 12, borderRadius: 12 },
  myReviewLabel: { fontSize: 12, marginBottom: 5 },
  stars: { fontSize: 20 },
  reviewComment: { marginTop: 8, fontSize: 14 },
  reviewActions: { flexDirection: 'row', marginTop: 12, gap: 15 },
  editAction: { fontWeight: 'bold' },
  deleteAction: { fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { padding: 24, borderRadius: 16, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 },
  starInteractive: { fontSize: 40 },
  commentInput: { borderWidth: 1, borderRadius: 12, padding: 16, minHeight: 120, textAlignVertical: 'top', marginBottom: 24 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalCancel: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  modalSubmit: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  cancelText: { fontWeight: 'bold' },
  submitText: { fontWeight: 'bold', color: '#000' },
});
