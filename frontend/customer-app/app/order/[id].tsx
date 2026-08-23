import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrderDetails } from '../../src/hooks/useOrders';
import { useCreateReview, useUpdateReview, useDeleteReview } from '../../src/hooks/useReviews';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  if (isError || !order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load order</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Text style={styles.backText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}><Text style={styles.headerBack}>Home</Text></TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.successBanner}>
          <Text style={styles.successText}>Order {order.status}!</Text>
          <Text style={styles.orderId}>ID: {order.id}</Text>
          <Text style={styles.dateText}>{new Date(order.createdAt).toLocaleString()}</Text>
          {order.payment && (
            <View style={styles.paymentBadge}>
              <Text style={styles.paymentBadgeText}>Payment: {order.payment.status}</Text>
              {order.payment.providerPaymentId && <Text style={styles.paymentIdText}>Ref: {order.payment.providerPaymentId}</Text>}
            </View>
          )}
          {!order.payment || order.payment.status !== 'SUCCESS' ? (
             <TouchableOpacity style={styles.retryPayButton} onPress={() => router.push('/checkout')}>
               <Text style={styles.retryPayText}>Complete Payment</Text>
             </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{order.restaurant.name}</Text>
          {order.items.map((item: any) => (
            <View key={item.id} style={styles.itemRow}>
              <View>
                <Text style={styles.itemName}>{item.quantity} × {item.nameSnapshot}</Text>
                {item.addons.map((a: any) => (
                  <Text key={a.id} style={styles.addonText}>+ {a.nameSnapshot} (₹{a.priceSnapshot})</Text>
                ))}
              </View>
              <Text style={styles.itemPrice}>₹{item.lineTotal}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status History</Text>
          {order.statusHistory.map((history: any, index: number) => (
            <View key={history.id} style={styles.historyRow}>
              <Text style={styles.historyStatus}>{history.newStatus}</Text>
              <Text style={styles.historyTime}>{new Date(history.timestamp).toLocaleTimeString()}</Text>
            </View>
          ))}
        </View>

        {order.status === 'COMPLETED' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
            {order.reviews && order.reviews.length > 0 ? (
              <View style={styles.existingReview}>
                <Text style={styles.myReviewLabel}>Your Review</Text>
                <Text style={styles.stars}>{'★'.repeat(order.reviews[0].rating)}{'☆'.repeat(5 - order.reviews[0].rating)}</Text>
                {order.reviews[0].comment ? <Text style={styles.reviewComment}>{order.reviews[0].comment}</Text> : null}
                <View style={styles.reviewActions}>
                  <TouchableOpacity onPress={() => openReviewModal(order.reviews[0])}><Text style={styles.editAction}>Edit</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteReview(order.reviews[0].id)}><Text style={styles.deleteAction}>Delete</Text></TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.rateButton} onPress={() => openReviewModal()}>
                <Text style={styles.rateButtonText}>Rate your order</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </ScrollView>

      <Modal visible={isReviewModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingReviewId ? 'Edit Review' : 'Rate Your Order'}</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[styles.starInteractive, rating >= star ? styles.starSelected : styles.starUnselected]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Write your review... (optional)"
              multiline
              maxLength={500}
              value={comment}
              onChangeText={setComment}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setReviewModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalSubmit, rating === 0 && { opacity: 0.5 }]} 
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerBack: { fontSize: 16, color: '#0066cc', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  successBanner: { backgroundColor: '#e6f7eb', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  successText: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', marginBottom: 5 },
  orderId: { fontSize: 14, color: '#555', marginBottom: 5 },
  dateText: { fontSize: 14, color: '#777' },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  itemName: { fontSize: 16, color: '#333', fontWeight: '500' },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  addonText: { fontSize: 14, color: 'gray', marginLeft: 15, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, color: 'gray' },
  totalValue: { fontSize: 22, fontWeight: 'bold' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  historyStatus: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  historyTime: { fontSize: 14, color: 'gray' },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  backButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  backText: { fontWeight: 'bold' },
  paymentBadge: { marginTop: 10, backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  paymentBadgeText: { fontWeight: 'bold', color: '#333' },
  paymentIdText: { fontSize: 10, color: 'gray', marginTop: 2 },
  retryPayButton: { marginTop: 15, backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryPayText: { fontWeight: 'bold', fontSize: 16 },
  rateButton: { backgroundColor: '#FFD700', padding: 15, borderRadius: 8, alignItems: 'center' },
  rateButtonText: { fontWeight: 'bold', fontSize: 16 },
  existingReview: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  myReviewLabel: { fontSize: 12, color: 'gray', marginBottom: 5 },
  stars: { color: '#FFD700', fontSize: 20 },
  reviewComment: { marginTop: 5, fontSize: 14, color: '#333' },
  reviewActions: { flexDirection: 'row', marginTop: 10, gap: 15 },
  editAction: { color: '#007AFF', fontWeight: 'bold' },
  deleteAction: { color: 'red', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 },
  starInteractive: { fontSize: 40 },
  starSelected: { color: '#FFD700' },
  starUnselected: { color: '#ccc' },
  commentInput: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 15, minHeight: 100, textAlignVertical: 'top', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modalCancel: { flex: 1, padding: 15, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center' },
  modalSubmit: { flex: 1, padding: 15, backgroundColor: '#FFD700', borderRadius: 8, alignItems: 'center' },
  cancelText: { fontWeight: 'bold', color: '#555' },
  submitText: { fontWeight: 'bold', color: '#000' },
});
