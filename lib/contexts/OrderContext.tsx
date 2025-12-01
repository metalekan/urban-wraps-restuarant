'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Order } from '@/lib/firebase/firestore-schema';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // console.log('[OrderContext] useEffect triggered, user:', user);
    
    if (!user) {
      // console.log('[OrderContext] No user, clearing orders');
      setOrders([]);
      setLoading(false);
      return;
    }

    // console.log('[OrderContext] Setting up query for userId:', user.uid);
    setLoading(true);
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // console.log('[OrderContext] Starting onSnapshot listener');
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // console.log('[OrderContext] Snapshot received, docs count:', snapshot.docs.length);
        const orderData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('[OrderContext] Order doc:', doc.id, data);
          return {
            id: doc.id,
            ...data
          };
        }) as Order[];
        
        // console.log('[OrderContext] Final orderData:', orderData);
        setOrders(orderData);
        setLoading(false);
      },
      (err) => {
        console.error('[OrderContext] Error fetching orders:', err);
        console.error('[OrderContext] Error code:', err.code);
        console.error('[OrderContext] Error message:', err.message);
        setError('Failed to fetch orders');
        setLoading(false);
      }
    );

    return () => {
      // console.log('[OrderContext] Cleaning up listener');
      unsubscribe();
    };
  }, [user]);

  return (
    <OrderContext.Provider value={{ orders, loading, error }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
