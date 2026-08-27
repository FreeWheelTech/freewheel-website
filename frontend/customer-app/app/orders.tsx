import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomerOrders } from '../src/hooks/useOrders';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';

export default function OrdersScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data: orders, isLoading, isError, refetch } = useCustomerOrders();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Unable to load orders</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.orderCard, { backgroundColor: theme.card }]} 
      onPress={() => router.push(`/order/${item.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.restaurantName, { color: theme.text }]}>{item.restaurant.name}</Text>
        <View style={[
          styles.statusBadge, 
          item.status === 'PENDING' ? { backgroundColor: theme.warning } : { backgroundColor: theme.success }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: item.status === 'PENDING' ? '#856404' : '#FFFFFF' }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={[styles.dateText, { color: theme.textSecondary }]}>
        {new Date(item.createdAt).toLocaleDateString()} - {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
      <Text style={[styles.itemsCount, { color: theme.textSecondary }]}>
        {item.items.length} items
      </Text>
      <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
        <Text style={[styles.totalText, { color: theme.text }]}>Total: ₹{item.total}</Text>
        <Text style={[styles.viewDetailsText, { color: theme.accent }]}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={orders || []}
        keyExtractor={i => i.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>You haven't placed any orders yet.</Text>
            <Button title="Browse Menu" onPress={() => router.push('/')} />
          </View>
        }
      />
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
  list: { padding: 20 },
  orderCard: { 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 16, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  restaurantName: { fontSize: 18, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  dateText: { fontSize: 14, marginBottom: 4 },
  itemsCount: { fontSize: 14, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 16 },
  totalText: { fontSize: 16, fontWeight: 'bold' },
  viewDetailsText: { fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, marginBottom: 20 },
  errorText: { fontSize: 18, marginBottom: 16 },
});
