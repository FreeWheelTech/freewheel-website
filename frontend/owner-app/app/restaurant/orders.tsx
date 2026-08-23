import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useOwnerOrders } from '../../src/hooks/useOwnerOrders';
import { useRouter } from 'expo-router';

export default function RestaurantOrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, isError, refetch } = useOwnerOrders();
  const [filter, setFilter] = useState('ALL');

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load orders</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
      </View>
    );
  }

  const filteredOrders = orders?.filter((o: any) => filter === 'ALL' || o.status === filter) || [];

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => router.push(`/restaurant/order/${item.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order #{item.id.substring(0, 8)}</Text>
        <Text style={[styles.statusBadge, item.status === 'PENDING' ? styles.pending : styles.completed]}>{item.status}</Text>
      </View>
      <Text style={styles.customerName}>Customer: {item.customerProfile.user.name}</Text>
      <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
      <View style={styles.divider} />
      {item.items.map((orderItem: any) => (
        <View key={orderItem.id} style={styles.itemRow}>
          <Text style={styles.itemText}>{orderItem.quantity} × {orderItem.nameSnapshot}</Text>
          {orderItem.addons.map((a: any) => (
            <Text key={a.id} style={styles.addonText}>+ {a.nameSnapshot}</Text>
          ))}
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <Text style={styles.totalText}>Total: ₹{item.total}</Text>
        <Text style={styles.viewText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.headerBack}>← Dashboard</Text></TouchableOpacity>
        <Text style={styles.title}>Incoming Orders</Text>
        <View style={{width: 70}} />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statuses.map(s => (
            <TouchableOpacity 
              key={s} 
              style={[styles.filterChip, filter === s && styles.filterChipActive]}
              onPress={() => setFilter(s)}
            >
              <Text style={[styles.filterText, filter === s && styles.filterTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={i => i.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No incoming orders right now.</Text>
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
  headerBack: { fontSize: 16, color: '#0066cc' },
  title: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 15 },
  orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', fontSize: 12, fontWeight: 'bold' },
  pending: { backgroundColor: '#fff3cd', color: '#856404' },
  completed: { backgroundColor: '#d4edda', color: '#155724' },
  customerName: { fontSize: 16, color: '#333', marginBottom: 2 },
  dateText: { fontSize: 14, color: '#777', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  itemRow: { marginBottom: 5 },
  itemText: { fontSize: 16, color: '#333' },
  addonText: { fontSize: 14, color: 'gray', marginLeft: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: 'gray' },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  retryText: { fontWeight: 'bold' },
  viewText: { fontSize: 14, color: '#0066cc', fontWeight: 'bold' },
  filterContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10, paddingHorizontal: 15 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 10 },
  filterChipActive: { backgroundColor: '#000' },
  filterText: { fontSize: 14, color: '#333', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
});
