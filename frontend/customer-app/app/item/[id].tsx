import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMenuItem } from '../../src/hooks/useMenu';
import { useAddToCart } from '../../src/hooks/useCart';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';
import { CartBar } from '../../src/components/CartBar';

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
      prev.includes(addonId) ? prev.filter(a => a !== addonId) : [...prev, addonId],
    );
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      { menuItemId: item.id, quantity, addonIds: selectedAddons },
      {
        onSuccess: () => {
          Alert.alert('Added to Cart', `${quantity}x ${item.name} added.`, [
            { text: 'Go to Cart', onPress: () => router.push('/cart') },
            { text: 'Continue Shopping', style: 'cancel' },
          ]);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Failed to add item';
          Alert.alert('Error', msg);
        },
      },
    );
  };

  // Dietary badge text
  const dietaryLabel = () => {
    const tag = item.dietaryTags?.[0];
    if (tag === 'Veg') return '🟢 Vegetarian';
    if (tag === 'Non-Veg') return '🔴 Non-Vegetarian';
    if (item.dietaryType === 'VEG') return '🟢 Vegetarian';
    if (item.dietaryType === 'EGG') return '🟡 Contains Egg';
    if (item.dietaryType === 'NON_VEG') return '🔴 Non-Vegetarian';
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Top nav ── */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Hero image — uses item.imageUrl from the authoritative data source ── */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.heroPlaceholder, { backgroundColor: theme.backgroundElement }]}>
            <Text style={{ fontSize: 64 }}>🍽️</Text>
          </View>
        )}

        {/* ── Detail card ── */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {/* Name + dietary */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
              {item.name}
            </Text>
            {dietaryLabel() && (
              <Text style={[
                styles.dietaryBadge,
                { color: item.dietaryTags?.[0] === 'Veg' || item.dietaryType === 'VEG'
                    ? theme.success
                    : theme.error },
              ]}>
                {dietaryLabel()}
              </Text>
            )}
          </View>

          {/* Description */}
          {item.description ? (
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          ) : null}

          {/* Price */}
          <Text style={[styles.price, { color: theme.text }]}>₹{item.price}</Text>

          {/* Unavailable banner */}
          {!item.isAvailable && (
            <Text style={[styles.unavailableText, { color: theme.error }]}>
              Currently Unavailable
            </Text>
          )}

          {/* ── Add-ons ── */}
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
                      selectedAddons.includes(addon.id) && { backgroundColor: theme.accent, borderColor: theme.accent },
                    ]}>
                      {selectedAddons.includes(addon.id) && (
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                      )}
                    </View>
                    <Text style={[
                      styles.addonName,
                      { color: theme.text },
                      !addon.availability && { color: theme.textSecondary },
                    ]}>
                      {addon.name}
                    </Text>
                  </View>
                  <Text style={[styles.addonPrice, { color: theme.textSecondary }]}>
                    + ₹{addon.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Quantity stepper ── */}
          {item.isAvailable !== false && (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                testID="decrement-btn"
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}
              >
                <Text style={[styles.qtyText, { color: theme.text }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.qtyLabel, { color: theme.text }]}>{quantity}</Text>
              <TouchableOpacity
                testID="increment-btn"
                onPress={() => setQuantity(q => Math.min(99, q + 1))}
                style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}
              >
                <Text style={[styles.qtyText, { color: theme.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button
            title={item.isAvailable !== false ? 'Add to Cart' : 'Unavailable'}
            onPress={handleAddToCart}
            disabled={item.isAvailable === false || addToCartMutation.isPending}
            isLoading={addToCartMutation.isPending}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* Extra breathing room above CartBar */}
        <View style={{ height: 96 }} />
      </ScrollView>

      {/* Sticky Cart Bar */}
      <CartBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { flexGrow: 1 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

  // ── Nav header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backButton: { width: 40 },

  // ── Hero image ── (full-width, 240 px tall — same image that appears in the menu card)
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#EEE',
  },
  heroPlaceholder: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Content card ──
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  titleRow:    { flexDirection: 'column', marginBottom: 8 },
  title:       { fontSize: 26, fontWeight: 'bold', marginBottom: 6 },
  dietaryBadge:{ fontSize: 13, fontWeight: '600', marginBottom: 4 },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 14, color: '#666' },
  price:       { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  unavailableText: { color: '#D32F2F', fontWeight: 'bold', marginBottom: 8 },

  // ── Add-ons ──
  addonsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    paddingTop: 18,
    paddingBottom: 10,
  },
  addonsTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 14 },
  addonItem:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  checkbox:    { width: 22, height: 22, borderWidth: 1.5, borderRadius: 6, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  addonName:   { fontSize: 15, fontWeight: '500' },
  addonPrice:  { fontSize: 15 },

  // ── Quantity ──
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  qtyBtn:   { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 24 },
  qtyText:  { fontSize: 24, fontWeight: 'bold' },
  qtyLabel: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 28 },

  errorText: { fontSize: 18, marginBottom: 16, textAlign: 'center' },
});
