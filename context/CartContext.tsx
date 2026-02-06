'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Crear en local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('No se pudo analizar el carrito desde el almacenamiento local', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar en local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('shopping-cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    setCart((prev) => {
      // Crear una clave única para esta combinación de ítems para verificar duplicados
      // Ejemplo: Producto 1 + Opción A es diferente de Producto 1 + Opción B
      const existingItemIndex = prev.findIndex(
        (i) => 
          i.productId === item.productId && 
          i.selectedOptionId === item.selectedOptionId
      );

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si se verifica que el ítem ya existe
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += item.quantity;
        return newCart;
      } else {
        // Agregar nuevo ítem
        return [...prev, { ...item, cartId: crypto.randomUUID() }];
      }
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
