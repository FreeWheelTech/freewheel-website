import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartContext } from '../context/CartContext';
import { useTheme } from '../hooks/use-theme';

/**
 * CartBar — Zomato-style sticky bottom cart summary bar.
 *
 * Renders nothing when the cart is empty.
 * Slides up when the first item is added, slides down when cart is cleared.
 */
export function CartBar() {
  const router = useRouter();
  const theme = useTheme();
  const { cartCount, cart } = useCartContext();

  const slideAnim = useRef(new Animated.Value(80)).current; // start hidden below screen

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: cartCount > 0 ? 0 : 80,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
    }).start();
  }, [cartCount, slideAnim]);

  if (cartCount === 0) return null;

  const subtotal = cart?.subtotal ?? 0;
  const itemLabel = cartCount === 1 ? '1 item' : `${cartCount} items`;

  return (
    <Animated.View
      style={[
        styles.bar,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity
        style={[styles.inner, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/cart' as any)}
        activeOpacity={0.88}
      >
        {/* Left: item count pill */}
        <View style={styles.countPill}>
          <Text style={[styles.countText, { color: theme.primary }]}>{cartCount}</Text>
        </View>

        {/* Center: label */}
        <View style={styles.center}>
          <Text style={styles.mainLabel} numberOfLines={1}>
            {itemLabel}
          </Text>
          {subtotal > 0 && (
            <Text style={styles.subLabel}>₹{subtotal}</Text>
          )}
        </View>

        {/* Right: arrow */}
        <View style={styles.rightChevron}>
          <Text style={styles.chevronText}>Continue →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 8,
    // subtle shadow so it floats above the list
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  countPill: {
    backgroundColor: '#FFFFFF22',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  countText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#fff',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFFCC',
  },
  rightChevron: {
    paddingLeft: 8,
  },
  chevronText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
