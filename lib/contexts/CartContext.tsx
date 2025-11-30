'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Cart } from '../firebase/firestore-schema';
import { calculateTax, generateCartItemId } from '../utils/format';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'urban-wraps-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return; // Don't save before initialization
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, isInitialized]);

  // Calculate totals
  const calculateTotals = (items: CartItem[]): Cart => {
    const subtotal = items.reduce((sum, item) => sum + item.itemTotal * item.quantity, 0);
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;

    return { items, subtotal, tax, total };
  };

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: generateCartItemId(),
    };

    const newItems = [...cart.items, newItem];
    setCart(calculateTotals(newItems));
    toast.success('Added to cart!');
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const newItems = cart.items.filter((item) => item.id !== itemId);
    setCart(calculateTotals(newItems));
    toast.success('Removed from cart');
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const newItems = cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCart(calculateTotals(newItems));
  };

  // Clear cart
  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });
    // We don't toast here to avoid double toasts on success page
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items: cart.items,
    subtotal: cart.subtotal,
    tax: cart.tax,
    total: cart.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    isInitialized,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
