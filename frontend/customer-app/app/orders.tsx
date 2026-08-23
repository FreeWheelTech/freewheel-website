import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomerOrders } from '../src/hooks/useOrders';

export default function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, isError, refetch } = useCustomerOrders();

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load orders</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => router.push(`/order/${item.id}` as any)}>
      <View style={styles.cardHeader}>
        <Text style={styles.restaurantName}>{item.restaurant.name}</Text>
        <Text style={[styles.statusBadge, item.status === 'PENDING' ? styles.pending : styles.completed]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()} - {new Date(item.createdAt).toLocaleTimeString()}</Text>
      <Text style={styles.itemsCount}>{item.items.length} items</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.totalText}>Total: ₹{item.total}</Text>
        <Text style={styles.viewDetailsText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.headerBack}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <View style={{width: 40}} />
      </View>

      <FlatList
        data={orders || []}
        keyExtractor={i => i.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
            <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/')}>
              <Text style={styles.browseText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerBack: { fontSize: 16, color: '#333' },
  title: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 15 },
  orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  restaurantName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', fontSize: 12, fontWeight: 'bold' },
  pending: { backgroundColor: '#fff3cd', color: '#856404' },
  completed: { backgroundColor: '#d4edda', color: '#155724' },
  dateText: { fontSize: 14, color: '#777', marginBottom: 5 },
  itemsCount: { fontSize: 14, color: '#555', marginBottom: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
  totalText: { fontSize: 16, fontWeight: 'bold' },
  viewDetailsText: { color: '#0066cc', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: 'gray', marginBottom: 20 },
  browseButton: { backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  browseText: { fontWeight: 'bold', fontSize: 16 },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  retryText: { fontWeight: 'bold' },
});
