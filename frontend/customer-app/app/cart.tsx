import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartContext } from '../src/context/CartContext';
import { useTheme } from '@/hooks/use-theme';

const DELIVERY_FEE = 30;
const GST_RATE = 0.05; // 5%

export default function CartScreen() {
  const router = useRouter();
  const theme = useTheme();

  const {
    cart,
    cartItems,
    cartCount,
    isLoading,
    updateQty,
    removeItem,
    clearCart,
  } = useCartContext();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  // ── Calculations ──────────────────────────────────────────────────────────
  // Prefer server-computed values; fall back to client-side if needed.
  const subtotal    = cart?.subtotal   ?? cartItems.reduce((s, i) => s + i.lineTotal, 0);
  const deliveryFee = cartItems.length > 0 ? (cart?.deliveryFee ?? DELIVERY_FEE) : 0;
  const taxes       = cart?.taxes       ?? Math.round(subtotal * GST_RATE);
  const grandTotal  = cart?.total       ?? (subtotal + deliveryFee + taxes);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleClear = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to empty your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearCart() },
    ]);
  };

  // ── Cart Item Row ─────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: any }) => {
    const lineTotal = item.lineTotal ?? item.price * item.quantity;

    return (
      <View style={[styles.cartItem, { backgroundColor: theme.card }]}>
        {/* Item image */}
        {item.menuItem.imageUrl ? (
          <Image
            source={{ uri: item.menuItem.imageUrl }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.itemImagePlaceholder, { backgroundColor: theme.backgroundElement }]}>
            <Text style={{ fontSize: 28 }}>🍽️</Text>
          </View>
        )}

        {/* Item info */}
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
            {item.menuItem.name}
          </Text>
          <Text style={[styles.unitPrice, { color: theme.textSecondary }]}>
            ₹{item.price} × {item.quantity}
          </Text>

          {/* Addons */}
          {item.addons && item.addons.length > 0 && (
            <View style={styles.addonsList}>
              {item.addons.map((a: any) => (
                <Text key={a.id} style={[styles.addonText, { color: theme.textSecondary }]}>
                  + {a.name} (₹{a.price})
                </Text>
              ))}
            </View>
          )}

          {/* Quantity stepper + line total */}
          <View style={styles.itemFooter}>
            <View style={[styles.qtyControl, { borderColor: theme.primary }]}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(item.menuItem.id, item.quantity - 1)}
                accessibilityLabel={`Decrease ${item.menuItem.name}`}
              >
                <Text style={[styles.qtyBtnText, { color: theme.primary }]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.qtyCount, { color: theme.primary }]}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(item.menuItem.id, item.quantity + 1)}
                accessibilityLabel={`Increase ${item.menuItem.name}`}
              >
                <Text style={[styles.qtyBtnText, { color: theme.primary }]}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.lineTotal, { color: theme.text }]}>₹{lineTotal}</Text>
          </View>
        </View>
      </View>
    );
  };

  // ── Bill Summary Card ─────────────────────────────────────────────────────
  const renderSummary = () => (
    <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
      <Text style={[styles.summaryTitle, { color: theme.text }]}>Bill Details</Text>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Item Total</Text>
        <Text style={[styles.summaryValue, { color: theme.text }]}>₹{subtotal}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Delivery Fee</Text>
        <Text style={[styles.summaryValue, { color: theme.text }]}>₹{deliveryFee}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>GST (5%)</Text>
        <Text style={[styles.summaryValue, { color: theme.text }]}>₹{taxes}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.summaryRow}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>Grand Total</Text>
        <Text style={[styles.totalValue, { color: theme.text }]}>₹{grandTotal}</Text>
      </View>
    </View>
  );

  // ── Empty Cart ─────────────────────────────────────────────────────────────
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={{ fontSize: 64 }}>🛒</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Add items from the menu to get started
      </Text>
      <TouchableOpacity
        style={[styles.browseBtn, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/' as any)}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Your Cart</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>BYTE++ Café</Text>
        </View>
        {cartCount > 0 ? (
          <TouchableOpacity onPress={handleClear}>
            <Text style={[styles.clearText, { color: theme.error }]}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* ── Content ── */}
      {cartItems.length === 0 ? (
        renderEmpty()
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListFooterComponent={renderSummary}
          />

          {/* ── Place Order Footer ── */}
          <View style={[styles.footer, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.footerRow}>
              <View>
                <Text style={[styles.footerItemCount, { color: theme.textSecondary }]}>
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </Text>
                <Text style={[styles.footerTotal, { color: theme.text }]}>₹{grandTotal}</Text>
              </View>
              <TouchableOpacity
                style={[styles.placeOrderBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/checkout' as any)}
              >
                <Text style={styles.placeOrderText}>Place Order →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backButton:   { width: 40 },
  headerCenter: { alignItems: 'center' },
  headerTitle:  { fontSize: 18, fontWeight: 'bold' },
  headerSub:    { fontSize: 11, fontWeight: '600', marginTop: 1 },
  clearText:    { fontSize: 14, fontWeight: '600' },

  // ── List ──
  list: { padding: 16, paddingBottom: 12 },

  // ── Cart Item Card ──
  cartItem: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  itemImage: {
    width: 88,
    height: '100%',
    minHeight: 110,
  },
  itemImagePlaceholder: {
    width: 88,
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemName:  { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  unitPrice: { fontSize: 13, marginBottom: 4 },
  addonsList: { marginBottom: 6 },
  addonText:  { fontSize: 11, marginBottom: 2 },

  // Item footer (qty + line total)
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn:     { paddingHorizontal: 10, paddingVertical: 5 },
  qtyBtnText: { fontSize: 16, fontWeight: '800', lineHeight: 20 },
  qtyCount:   { fontSize: 14, fontWeight: '800', minWidth: 22, textAlign: 'center' },
  lineTotal:  { fontSize: 15, fontWeight: '700' },

  // ── Bill Summary Card ──
  summaryCard: {
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  divider:      { height: 1, marginVertical: 12 },
  totalLabel:   { fontSize: 16, fontWeight: '700' },
  totalValue:   { fontSize: 18, fontWeight: '800' },

  // ── Empty Cart ──
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle:     { fontSize: 22, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtitle:  { fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  browseBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },

  // ── Footer / Place Order ──
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerItemCount: { fontSize: 12, marginBottom: 2 },
  footerTotal:     { fontSize: 20, fontWeight: '800' },
  placeOrderBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
