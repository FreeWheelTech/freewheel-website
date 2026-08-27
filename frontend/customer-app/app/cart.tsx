import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../src/hooks/useCart';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';

export default function CartScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  const { data: cart, isLoading, isError, refetch } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (isError || !cart) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Unable to load cart</Text>
        <Button title="Retry" onPress={() => refetch()} />
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
    <View style={[styles.cartItem, { backgroundColor: theme.card }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.menuItem.name}</Text>
        <Text style={[styles.lineTotal, { color: theme.text }]}>₹{item.lineTotal}</Text>
      </View>
      <Text style={[styles.basePrice, { color: theme.textSecondary }]}>₹{item.menuItem.price}</Text>

      {item.addons?.length > 0 && (
        <View style={styles.addonsList}>
          {item.addons.map((a: any) => (
            <Text key={a.id} style={[styles.addonText, { color: theme.textSecondary }]}>
              {a.name} (+₹{a.price})
            </Text>
          ))}
        </View>
      )}

      <View style={styles.itemFooter}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]} 
            onPress={() => item.quantity > 1 ? updateMutation.mutate({ cartItemId: item.id, quantity: item.quantity - 1 }) : removeMutation.mutate(item.id)}
          >
            <Text style={[styles.qtyText, { color: theme.text }]}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.qtyLabel, { color: theme.text }]}>{item.quantity}</Text>
          <TouchableOpacity 
            style={[styles.qtyBtn, { backgroundColor: theme.primary }]} 
            onPress={() => updateMutation.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
          >
            <Text style={[styles.qtyText, { color: theme.primaryText }]}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeMutation.mutate(item.id)}>
          <Text style={[styles.removeText, { color: theme.error }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Your Cart</Text>
        {cart.items.length > 0 ? (
          <TouchableOpacity onPress={handleClear}>
            <Text style={[styles.clearText, { color: theme.error }]}>Clear</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>

      <FlatList
        data={cart.items}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Your cart is empty.</Text>
            <Button title="Browse Menu" onPress={() => router.push('/')} />
          </View>
        }
      />

      {cart.items.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>₹{cart.subtotal}</Text>
          </View>
          <Button 
            title="Proceed to Checkout" 
            onPress={() => router.push('/checkout')}
            size="large"
          />
        </View>
      )}
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
  backButton: { 
    width: 40,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  clearText: { fontSize: 16, fontWeight: '600' },
  list: { padding: 20, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, marginBottom: 20 },
  cartItem: { 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 16, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 10 },
  lineTotal: { fontSize: 18, fontWeight: 'bold' },
  basePrice: { fontSize: 14, marginTop: 4 },
  addonsList: { marginTop: 10, paddingLeft: 8, borderLeftWidth: 2, borderColor: '#E8DCC8' },
  addonText: { fontSize: 12, marginBottom: 2 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { 
    width: 32, 
    height: 32, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  qtyText: { fontSize: 18, fontWeight: 'bold', marginTop: -2 },
  qtyLabel: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 16 },
  removeText: { fontWeight: 'bold', fontSize: 14 },
  footer: { 
    padding: 24, 
    borderTopWidth: 1, 
    paddingBottom: 40,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  summaryLabel: { fontSize: 16 },
  summaryValue: { fontSize: 24, fontWeight: 'bold' },
  errorText: { fontSize: 18, marginBottom: 16 },
});
