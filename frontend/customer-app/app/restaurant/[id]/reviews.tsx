import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantReviews, useCreateReview, useDeleteReview, useUpdateReview } from '../../../src/hooks/useReviews';
import { useAuth } from '../../../src/context/AuthContext';

export default function RestaurantReviewsScreen() {
  const { id: restaurantId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useRestaurantReviews(restaurantId as string);
  const deleteReviewMutation = useDeleteReview(restaurantId as string);
  
  const reviews = data?.pages.flatMap(p => p.data) || [];

  const handleDelete = (reviewId: string) => {
    Alert.alert('Delete Review', 'Are you sure you want to delete your review?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReviewMutation.mutate(reviewId) }
    ]);
  };

  const renderReview = ({ item }: { item: any }) => {
    // Current user identification isn't directly exposed in item unless we include userId, 
    // but the backend only deletes if owned. For UI we might just show delete for all and let backend reject,
    // or we can hide it if we know customerName matches (brittle) or if we return isOwner.
    // For simplicity, we just display the review.
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.stars}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
        {item.comment ? <Text style={styles.comment}>{item.comment}</Text> : null}
        
        {/* We would ideally only show this if item.customerId === currentUserId */}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteBtnText}>Delete (If Yours)</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
        <View style={{ width: 50 }} />
      </View>

      {isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Unable to load reviews</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews yet.</Text>
            </View>
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color="#FFD700" /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { fontSize: 16, color: '#007AFF' },
  title: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 16 },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  customerName: { fontWeight: 'bold', fontSize: 16 },
  date: { color: '#888', fontSize: 12 },
  stars: { color: '#FFD700', fontSize: 18, marginBottom: 8 },
  comment: { fontSize: 14, color: '#333', lineHeight: 20 },
  deleteBtn: { marginTop: 12, alignSelf: 'flex-end' },
  deleteBtnText: { color: 'red', fontSize: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888' },
  errorText: { color: 'red' },
});
