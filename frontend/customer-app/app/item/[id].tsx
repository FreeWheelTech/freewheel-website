import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMenuItem } from '../../src/hooks/useMenu';
import { useAddToCart } from '../../src/hooks/useCart';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';

export default function ItemDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const { data: item, isLoading, isError, refetch } = useMenuItem(id as string);
  const addToCartMutation = useAddToCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (isError || !item) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Unable to load item details</Text>
        <Button title="Retry" onPress={() => refetch()} />
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: theme.accent }}>Go Back</Text>
        </TouchableOpacity>
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
          {item.description && <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text>}
          <Text style={[styles.price, { color: theme.text }]}>₹{item.price}</Text>

          <View style={styles.tagsRow}>
            {item.dietaryType && (
              <Text style={[styles.dietaryIcon, item.dietaryType === 'VEG' ? { color: theme.success } : { color: theme.error }]}>
                {item.dietaryType === 'VEG' ? '🟢 Vegetarian' : item.dietaryType === 'EGG' ? '🟡 Contains Egg' : '🔴 Non-Vegetarian'}
              </Text>
            )}
            {!item.availability && <Text style={[styles.unavailableText, { color: theme.error }]}>Currently Unavailable</Text>}
          </View>

          {item.addons && item.addons.length > 0 && (
            <View style={[styles.addonsContainer, { borderColor: theme.border }]}>
              <Text style={[styles.addonsTitle, { color: theme.text }]}>Add-ons</Text>
              {item.addons.map((addon: any) => (
                <TouchableOpacity 
                  key={addon.id} 
                  style={styles.addonItem}
                  onPress={() => toggleAddon(addon.id)}
                  disabled={!addon.availability}
                  testID={`addon-${addon.name}`}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[
                      styles.checkbox, 
                      { borderColor: theme.border },
                      selectedAddons.includes(addon.id) && { backgroundColor: theme.accent, borderColor: theme.accent }
                    ]}>
                      {selectedAddons.includes(addon.id) && <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>✓</Text>}
                    </View>
                    <Text style={[styles.addonName, { color: theme.text }, !addon.availability && { color: theme.textSecondary }]}>{addon.name}</Text>
                  </View>
                  <Text style={[styles.addonPrice, { color: theme.textSecondary }, !addon.availability && { color: theme.textSecondary }]}>+ ₹{addon.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {item.availability && (
            <View style={styles.quantityContainer}>
              <TouchableOpacity testID="decrement-btn" onPress={() => setQuantity(q => Math.max(1, q - 1))} style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.qtyText, { color: theme.text }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.qtyLabel, { color: theme.text }]}>{quantity}</Text>
              <TouchableOpacity testID="increment-btn" onPress={() => setQuantity(q => Math.min(99, q + 1))} style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.qtyText, { color: theme.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button
            title={item.availability ? 'Add to Cart' : 'Unavailable'}
            onPress={handleAddToCart}
            disabled={!item.availability || addToCartMutation.isPending}
            loading={addToCartMutation.isPending}
            style={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: { width: 40 },
  card: { padding: 24, borderRadius: 24, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 16, marginBottom: 16, lineHeight: 24 },
  price: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  tagsRow: { flexDirection: 'row', gap: 15, marginBottom: 24 },
  dietaryIcon: { fontSize: 14, fontWeight: 'bold' },
  unavailableText: { fontWeight: 'bold' },
  addonsContainer: { marginTop: 8, borderTopWidth: 1, paddingTop: 20, paddingBottom: 10 },
  addonsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  addonItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  checkbox: { width: 24, height: 24, borderWidth: 1, borderRadius: 6, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  addonName: { fontSize: 16, fontWeight: '500' },
  addonPrice: { fontSize: 16 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  qtyBtn: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 24 },
  qtyText: { fontSize: 24, fontWeight: 'bold' },
  qtyLabel: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 32 },
  errorText: { fontSize: 18, marginBottom: 16 },
});
