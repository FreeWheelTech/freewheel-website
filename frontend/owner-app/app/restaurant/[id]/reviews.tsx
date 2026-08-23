import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantReviews } from '../../../src/hooks/useReviews';

export default function OwnerReviewsScreen() {
  const { id: restaurantId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useRestaurantReviews(restaurantId as string);
  
  const reviews = data?.pages.flatMap(p => p.data) || [];

  const renderReview = ({ item }: { item: any }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.stars}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
      {item.comment ? <Text style={styles.comment}>{item.comment}</Text> : null}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Customer Reviews</Text>
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
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color="#333" /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: { fontSize: 16, color: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  customerName: { fontWeight: 'bold', fontSize: 16 },
  date: { color: '#888', fontSize: 12 },
  stars: { color: '#FFD700', fontSize: 18, marginBottom: 8 },
  comment: { fontSize: 14, color: '#333', lineHeight: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888' },
  errorText: { color: 'red' },
});
