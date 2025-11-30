'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/format';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, subtotal, tax, total, clearCart } = useCart();

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container max-w-7xl mx-auto py-20 px-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some delicious wraps to get started!
              </p>
              <Link href="/order">
                <Button size="lg">
                  Start Building Your Wrap
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Link href="/order">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Shopping Cart</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>

            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.wrapName}</h3>
                      
                      {/* Ingredients */}
                      {item.ingredients.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Ingredients:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients.map((ing, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-muted px-2 py-1 rounded"
                              >
                                {ing.name}
                                {ing.priceAdd > 0 && ` (+${formatCurrency(ing.priceAdd)})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add-ons */}
                      {item.addOns.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Add-ons:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.addOns.map((addon, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-muted px-2 py-1 rounded"
                              >
                                {addon.name}
                                {addon.price > 0 && ` (+${formatCurrency(addon.price)})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, Math.min(20, item.quantity + 1))}
                          disabled={item.quantity >= 20}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(item.itemTotal)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.itemTotal / item.quantity)} each
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8.5%)</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Taxes and shipping calculated at checkout
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
