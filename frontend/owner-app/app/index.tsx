import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRestaurants } from '../src/hooks/useOwnerMenu';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function OwnerDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const { data: restaurants, isLoading, isError } = useRestaurants();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load restaurants</Text>
      </View>
    );
  }

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/restaurant/${item.id}/menu` as any)}
    >
      <View style={styles.cardHeaderRow}>
        <View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardAddress}>{item.address}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {item.averageRating ? Number(item.averageRating).toFixed(1) : 'New'}</Text>
          <Text style={styles.reviewCountText}>({item.reviewCount || 0})</Text>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/restaurant/orders' as any)}>
          <Text style={styles.actionText}>Incoming Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reviewButton} onPress={() => router.push(`/restaurant/${item.id}/reviews` as any)}>
          <Text style={styles.actionText}>View Reviews</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.manageText}>Manage Menu →</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Owner Dashboard</Text>
        <TouchableOpacity onPress={logout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No restaurants assigned to you.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#333' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  logoutText: { color: '#ff6b6b', marginTop: 5 },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', maxWidth: '80%' },
  cardAddress: { fontSize: 14, color: 'gray', marginTop: 5 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ratingBadge: { backgroundColor: '#fff', padding: 5, borderRadius: 5, alignItems: 'flex-end' },
  ratingText: { color: '#FFD700', fontWeight: 'bold', fontSize: 18 },
  reviewCountText: { color: 'gray', fontSize: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionButton: { flex: 1, backgroundColor: '#FFD700', padding: 10, borderRadius: 5, alignItems: 'center' },
  reviewButton: { flex: 1, backgroundColor: '#eee', padding: 10, borderRadius: 5, alignItems: 'center' },
  actionText: { fontWeight: 'bold', fontSize: 14 },
  manageText: { fontSize: 16, color: '#0066cc', marginTop: 15, fontWeight: 'bold', textAlign: 'center' },
  errorText: { color: 'red', fontSize: 18 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
