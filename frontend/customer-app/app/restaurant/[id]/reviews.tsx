import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantReviews, useCreateReview, useDeleteReview, useUpdateReview } from '../../../src/hooks/useReviews';
import { useAuth } from '../../../src/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';

export default function RestaurantReviewsScreen() {
  const { id: restaurantId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
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
    return (
      <View style={[styles.reviewCard, { backgroundColor: theme.card }]}>
        <View style={styles.reviewHeader}>
          <Text style={[styles.customerName, { color: theme.text }]}>{item.customerName}</Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={[styles.stars, { color: theme.warning }]}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
        {item.comment ? <Text style={[styles.comment, { color: theme.text }]}>{item.comment}</Text> : null}
        
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={[styles.deleteBtnText, { color: theme.error }]}>Delete (If Yours)</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      {isError ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.error }]}>Unable to load reviews</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No reviews yet.</Text>
            </View>
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.accent} style={{ marginVertical: 16 }} /> : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backBtn: { width: 40 },
  title: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 16 },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  customerName: { fontWeight: 'bold', fontSize: 16 },
  date: { fontSize: 12 },
  stars: { fontSize: 18, marginBottom: 8 },
  comment: { fontSize: 14, lineHeight: 20 },
  deleteBtn: { marginTop: 12, alignSelf: 'flex-end' },
  deleteBtnText: { fontSize: 12, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16 },
  errorText: { fontSize: 16 },
});
