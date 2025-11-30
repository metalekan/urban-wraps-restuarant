'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOrders } from '@/lib/contexts/OrderContext';
import { Order, OrderItem } from '@/lib/firebase/firestore-schema';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Loader2, ShoppingBag, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();

  // No need for useEffect fetching as it's handled in the context

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet.
          </p>
          <Link href="/order">
            <Button>Order Now</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      case 'preparing':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'ready':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className='container max-w-4xl mx-auto p-8'>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>

      <div className="grid gap-6">
        {orders.map((order: Order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {order.createdAt instanceof Timestamp 
                      ? formatDate(order.createdAt.toDate()) 
                      : 'Just now'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(order.total)}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 && 's'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Items */}
                <div className="space-y-4">
                  {order.items.map((item: OrderItem, index: number) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {item.quantity}x {item.wrapName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {[
                            ...item.ingredients.map((i: { name: string }) => i.name),
                            ...item.addOns.map((a: { name: string }) => a.name),
                          ].join(', ')}
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.itemTotal * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Delivery/Pickup Info */}
                <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      {order.deliveryType === 'delivery' ? 'Delivery to:' : 'Pickup at Store'}
                    </p>
                    {order.deliveryType === 'delivery' && order.deliveryAddress ? (
                      <>
                        <p>{order.deliveryAddress.street}</p>
                        <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                      </>
                    ) : (
                      <p>123 Urban Wraps Blvd, Foodie City, FC 12345</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}
