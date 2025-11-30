import { Timestamp } from 'firebase/firestore';

// ============================================
// MENU ITEMS
// ============================================

export interface Wrap {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'protein' | 'veggie' | 'cheese' | 'other';
  priceAdd: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
  allergens?: string[];
}

export interface AddOn {
  id: string;
  name: string;
  type: 'spice' | 'sauce' | 'extra';
  price: number;
  optional: boolean;
  imageUrl?: string;
  status: 'active' | 'inactive';
}

// ============================================
// ORDER SYSTEM
// ============================================

export interface OrderItem {
  wrapId: string;
  wrapName: string;
  basePrice: number;
  ingredients: {
    id: string;
    name: string;
    priceAdd: number;
  }[];
  addOns: {
    id: string;
    name: string;
    price: number;
  }[];
  quantity: number;
  itemTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'paid';
  total: number;
  items: OrderItem[];
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ============================================
// RESERVATION SYSTEM
// ============================================

export interface Reservation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// USER SYSTEM
// ============================================

export interface User {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  orderHistory: string[]; // Array of order IDs
  reservationHistory: string[]; // Array of reservation IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// CART (Client-side only, not in Firestore)
// ============================================

export interface CartItem extends OrderItem {
  id: string; // Unique cart item ID
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}
