import React, { createContext, useContext, useCallback } from 'react';
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from '../hooks/useCart';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CartItem {
  id: string;          // cart item id (used for update/remove)
  menuItem: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    category?: { id: string; name: string };
  };
  quantity: number;
  price: number;        // effective unit price (base + addons)
  lineTotal: number;
  addons?: { id: string; name: string; price: number }[];
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  total: number;
}

export interface CartContextValue {
  cart: Cart | null;
  cartItems: CartItem[];
  cartCount: number;       // total number of individual items (sum of quantities)
  cartSubtotal: number;
  isLoading: boolean;

  // Helpers keyed by menu-item id
  getItemQty: (menuItemId: string) => number;
  getCartItemId: (menuItemId: string) => string | null;

  // Mutations
  addItem: (menuItemId: string, quantity?: number, addonIds?: string[]) => void;
  updateQty: (menuItemId: string, newQty: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;

  // Loading states for mutations
  isAdding: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const CartContext = createContext<CartContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: cart, isLoading } = useCart();
  const addMutation       = useAddToCart();
  const updateMutation    = useUpdateCartItem();
  const removeMutation    = useRemoveCartItem();
  const clearMutation     = useClearCart();

  const cartItems: CartItem[] = (cart as any)?.items ?? [];

  // ---- derived ----
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = (cart as any)?.subtotal ?? 0;

  // ---- helpers ----
  const getItemQty = useCallback(
    (menuItemId: string) => {
      const found = cartItems.find(i => i.menuItem.id === menuItemId);
      return found?.quantity ?? 0;
    },
    [cartItems],
  );

  const getCartItemId = useCallback(
    (menuItemId: string) => {
      const found = cartItems.find(i => i.menuItem.id === menuItemId);
      return found?.id ?? null;
    },
    [cartItems],
  );

  // ---- mutations ----
  const addItem = useCallback(
    (menuItemId: string, quantity = 1, addonIds: string[] = []) => {
      addMutation.mutate({ menuItemId, quantity, addonIds });
    },
    [addMutation],
  );

  const updateQty = useCallback(
    (menuItemId: string, newQty: number) => {
      const cartItemId = cartItems.find(i => i.menuItem.id === menuItemId)?.id;
      if (!cartItemId) return;
      if (newQty <= 0) {
        removeMutation.mutate(cartItemId);
      } else {
        updateMutation.mutate({ cartItemId, quantity: newQty });
      }
    },
    [cartItems, removeMutation, updateMutation],
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      removeMutation.mutate(cartItemId);
    },
    [removeMutation],
  );

  const clearCart = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  const value: CartContextValue = {
    cart: cart as Cart | null,
    cartItems,
    cartCount,
    cartSubtotal,
    isLoading,
    getItemQty,
    getCartItemId,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    isAdding:   addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used inside <CartProvider>');
  return ctx;
}
