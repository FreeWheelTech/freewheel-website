import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMenuItem } from '../../src/hooks/useMenu';
import { useAddToCart } from '../../src/hooks/useCart';

export default function ItemDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { data: item, isLoading, isError, refetch } = useMenuItem(id as string);
  const addToCartMutation = useAddToCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  if (isError || !item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load item details</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}><Text style={{ color: 'blue' }}>Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      { menuItemId: item.id, quantity, addonIds: selectedAddons },
      {
        onSuccess: () => {
          Alert.alert('Added to Cart', `${quantity}x ${item.name} added.`, [
            { text: 'Go to Cart', onPress: () => router.push('/cart') },
            { text: 'Continue Shopping', style: 'cancel' }
          ]);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Failed to add item';
          Alert.alert('Error', msg);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backButton}>← Back</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          {item.description && <Text style={styles.description}>{item.description}</Text>}
          <Text style={styles.price}>₹{item.price}</Text>

          <View style={styles.tagsRow}>
            {item.dietaryType && (
              <Text style={[styles.dietaryIcon, item.dietaryType === 'VEG' ? styles.veg : styles.nonVeg]}>
                {item.dietaryType === 'VEG' ? '🟢 Vegetarian' : item.dietaryType === 'EGG' ? '🟡 Contains Egg' : '🔴 Non-Vegetarian'}
              </Text>
            )}
            {!item.availability && <Text style={styles.unavailableText}>Currently Unavailable</Text>}
          </View>

          {item.addons && item.addons.length > 0 && (
            <View style={styles.addonsContainer}>
              <Text style={styles.addonsTitle}>Add-ons</Text>
              {item.addons.map((addon: any) => (
                <TouchableOpacity 
                  key={addon.id} 
                  style={styles.addonItem}
                  onPress={() => toggleAddon(addon.id)}
                  disabled={!addon.availability}
                  testID={`addon-${addon.name}`}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.checkbox, selectedAddons.includes(addon.id) && styles.checkboxSelected]}>
                      {selectedAddons.includes(addon.id) && <Text style={{color: '#fff', fontSize: 10}}>✓</Text>}
                    </View>
                    <Text style={[styles.addonName, !addon.availability && styles.disabledText]}>{addon.name}</Text>
                  </View>
                  <Text style={[styles.addonPrice, !addon.availability && styles.disabledText]}>+ ₹{addon.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {item.availability && (
            <View style={styles.quantityContainer}>
              <TouchableOpacity testID="decrement-btn" onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn}><Text style={styles.qtyText}>-</Text></TouchableOpacity>
              <Text style={styles.qtyLabel}>{quantity}</Text>
              <TouchableOpacity testID="increment-btn" onPress={() => setQuantity(q => Math.min(99, q + 1))} style={styles.qtyBtn}><Text style={styles.qtyText}>+</Text></TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.addToCartButton, (!item.availability || addToCartMutation.isPending) && styles.disabledButton]} 
            disabled={!item.availability || addToCartMutation.isPending}
            onPress={handleAddToCart}
          >
            {addToCartMutation.isPending ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.addToCartText}>{item.availability ? 'Add to Cart' : 'Unavailable'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  backButton: { fontSize: 18, color: '#333' },
  card: { margin: 15, padding: 20, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: 'gray', marginBottom: 10 },
  price: { fontSize: 22, color: '#444', marginBottom: 15 },
  tagsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  dietaryIcon: { fontSize: 14, fontWeight: 'bold' },
  veg: { color: 'green' },
  nonVeg: { color: 'red' },
  unavailableText: { color: 'red', fontWeight: 'bold' },
  addonsContainer: { marginTop: 20, borderTopWidth: 1, borderColor: '#eee', paddingTop: 15 },
  addonsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  addonItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#aaa', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  addonName: { fontSize: 16 },
  addonPrice: { fontSize: 16, color: 'gray' },
  disabledText: { color: '#ccc' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  qtyBtn: { width: 40, height: 40, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  qtyText: { fontSize: 20, fontWeight: 'bold' },
  qtyLabel: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 20 },
  addToCartButton: { marginTop: 10, backgroundColor: '#FFD700', padding: 15, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ddd' },
  addToCartText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  retryText: { fontWeight: 'bold' },
});
