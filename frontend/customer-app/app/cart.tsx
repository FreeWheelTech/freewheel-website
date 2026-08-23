import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../src/hooks/useCart';

export default function CartScreen() {
  const router = useRouter();
  const { data: cart, isLoading, isError, refetch } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  if (isError || !cart) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load cart</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
      </View>
    );
  }

  const handleClear = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to empty your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearMutation.mutate() }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.menuItem.name}</Text>
        <Text style={styles.lineTotal}>₹{item.lineTotal}</Text>
      </View>
      <Text style={styles.basePrice}>₹{item.menuItem.price}</Text>

      {item.addons.length > 0 && (
        <View style={styles.addonsList}>
          {item.addons.map((a: any) => (
            <Text key={a.id} style={styles.addonText}>{a.name} (+₹{a.price})</Text>
          ))}
        </View>
      )}

      <View style={styles.itemFooter}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => item.quantity > 1 ? updateMutation.mutate({ cartItemId: item.id, quantity: item.quantity - 1 }) : removeMutation.mutate(item.id)}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyLabel}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => updateMutation.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeMutation.mutate(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backButton}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        {cart.items.length > 0 ? (
          <TouchableOpacity onPress={handleClear}><Text style={styles.clearText}>Clear</Text></TouchableOpacity>
        ) : <View style={{width: 40}} />}
      </View>

      <FlatList
        data={cart.items}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/')}>
              <Text style={styles.browseText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {cart.items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{cart.subtotal}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  backButton: { fontSize: 16, color: '#333' },
  title: { fontSize: 20, fontWeight: 'bold' },
  clearText: { fontSize: 16, color: 'red' },
  list: { padding: 15 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: 'gray', marginBottom: 20 },
  browseButton: { backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  browseText: { fontWeight: 'bold', fontSize: 16 },
  cartItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  lineTotal: { fontSize: 18, fontWeight: 'bold' },
  basePrice: { color: 'gray', marginTop: 2 },
  addonsList: { marginTop: 10 },
  addonText: { color: '#555', fontSize: 14 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 30, height: 30, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 15 },
  qtyText: { fontSize: 18, fontWeight: 'bold' },
  qtyLabel: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 15 },
  removeText: { color: 'red', fontWeight: 'bold' },
  footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#ddd' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryLabel: { fontSize: 18, color: 'gray' },
  summaryValue: { fontSize: 22, fontWeight: 'bold' },
  checkoutButton: { backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center' },
  checkoutText: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  retryText: { fontWeight: 'bold' },
});
