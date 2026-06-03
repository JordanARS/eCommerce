'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/api';

export interface CartItem {
  cartId: string; // Único especificamente para este combo en el carrito
  productId: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptionId?: number;
  selectedOptionName?: string;

}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  isAuthenticated: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserKey, setCurrentUserKey] = useState<string | null>(null);

  const getUserCartKey = (userKey: string) => `shopping-cart:user:${userKey}`;

  const extractUserKey = (profile: unknown): string | null => {
    if (!profile || typeof profile !== 'object') return null;

    const raw = profile as Record<string, unknown>;
    const nested = raw.user && typeof raw.user === 'object'
      ? (raw.user as Record<string, unknown>)
      : raw.data && typeof raw.data === 'object'
        ? (raw.data as Record<string, unknown>)
        : null;

    const idCandidate = raw.id ?? raw.userId ?? raw.sub ?? nested?.id ?? nested?.userId;
    if (typeof idCandidate === 'number' || typeof idCandidate === 'string') {
      return `id:${String(idCandidate)}`;
    }

    const emailCandidate = raw.email ?? nested?.email;
    if (typeof emailCandidate === 'string' && emailCandidate.trim()) {
      return `email:${emailCandidate.trim().toLowerCase()}`;
    }

    return null;
  };

  const mergeItem = (items: CartItem[], item: Omit<CartItem, 'cartId'>) => {
    const existingItemIndex = items.findIndex(
      (i) => i.productId === item.productId && i.selectedOptionId === item.selectedOptionId
    );

    if (existingItemIndex >= 0) {
      const nextItems = [...items];
      nextItems[existingItemIndex].quantity += item.quantity;
      return nextItems;
    }

    return [...items, { ...item, cartId: crypto.randomUUID() }];
  };

  const syncAuthAndCart = React.useCallback(async () => {
    const profile = await authService.getProfile();
    const userKey = extractUserKey(profile);

    if (!userKey) {
      setIsAuthenticated(false);
      setCurrentUserKey(null);
      setCart([]);
      setIsCartOpen(false);
      setIsInitialized(true);
      return;
    }

    setIsAuthenticated(true);
    setCurrentUserKey(userKey);

    const cartKey = getUserCartKey(userKey);
    let nextCart: CartItem[] = [];
    const savedCart = localStorage.getItem(cartKey);

    if (savedCart) {
      try {
        nextCart = JSON.parse(savedCart);
      } catch (e) {
        console.error('No se pudo analizar el carrito desde el almacenamiento local', e);
      }
    } else {
      const legacyCart = localStorage.getItem('shopping-cart');
      if (legacyCart) {
        try {
          nextCart = JSON.parse(legacyCart);
          localStorage.removeItem('shopping-cart');
        } catch (e) {
          console.error('No se pudo migrar el carrito legado', e);
        }
      }
    }

    const pendingItemRaw = localStorage.getItem('pending-cart-item');
    if (pendingItemRaw) {
      try {
        const pendingItem = JSON.parse(pendingItemRaw) as Omit<CartItem, 'cartId'>;
        nextCart = mergeItem(nextCart, pendingItem);
        setIsCartOpen(true);
      } catch (e) {
        console.error('No se pudo procesar el item pendiente', e);
      } finally {
        localStorage.removeItem('pending-cart-item');
      }
    }

    setCart(nextCart);
    setIsInitialized(true);
  }, []);

  // Sincroniza el carrito y la sesión al montar y cuando cambie el estado de auth.
  useEffect(() => {
    syncAuthAndCart();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncAuthAndCart();
      }
    };

    const onFocus = () => {
      syncAuthAndCart();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'auth-state-changed') {
        syncAuthAndCart();
      }
    };

    const onLocalAuthChanged = () => {
      syncAuthAndCart();
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-state-changed-local', onLocalAuthChanged);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-state-changed-local', onLocalAuthChanged);
    };
  }, [syncAuthAndCart]);

  // Guarda el carrito por usuario autenticado.
  useEffect(() => {
    if (isInitialized && isAuthenticated && currentUserKey !== null) {
      localStorage.setItem(getUserCartKey(currentUserKey), JSON.stringify(cart));
    }
  }, [cart, isInitialized, isAuthenticated, currentUserKey]);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    if (!isAuthenticated) {
      localStorage.setItem('pending-cart-item', JSON.stringify(item));
      const currentPath = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    setCart((prev) => {
      return mergeItem(prev, item);
    });
    setIsCartOpen(true); // Abrir carrito al agregar
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    if (!isAuthenticated) return;
    setIsCartOpen((prev) => !prev);
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        isAuthenticated,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
