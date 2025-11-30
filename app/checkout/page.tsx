'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/format';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, total } = useCart();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState('pickup');

  // Form state
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    street: userProfile?.address?.street || '',
    city: userProfile?.address?.city || '',
    state: userProfile?.address?.state || '',
    zipCode: userProfile?.address?.zipCode || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (items.length === 0) {
        toast.error('Your cart is empty');
        router.push('/order');
        return;
      }

      if (!user) {
        toast.error('You must be logged in to checkout');
        router.push('/auth');
        return;
      }

      // 1. Create Order in Firestore
      const orderData = {
        userId: user.uid,
        items: items,
        subtotal,
        tax,
        total: total + (deliveryType === 'delivery' ? 5 : 0),
        status: 'pending', // Initial status
        createdAt: new Date(), // Will be converted to Timestamp by Firestore
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        } : null,
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }
      };

      // We need to import these
      const { addDoc, collection, getFirestore } = await import('firebase/firestore');
      const app = (await import('@/lib/firebase/config')).default;
      const db = getFirestore(app);
      
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = orderRef.id;

      // 2. Create Stripe Session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userId: user.uid,
          userEmail: formData.email,
          deliveryType,
          address: deliveryType === 'delivery' ? {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          } : null,
          orderId, // Pass the order ID to the API
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleCheckout} className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue="pickup"
                  value={deliveryType}
                  onValueChange={setDeliveryType}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                    <Label
                      htmlFor="pickup"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-lg font-semibold mb-1">Pickup</span>
                      <span className="text-sm text-muted-foreground">Free</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                    <Label
                      htmlFor="delivery"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-lg font-semibold mb-1">Delivery</span>
                      <span className="text-sm text-muted-foreground">+$5.00</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address (Conditional) */}
            {deliveryType === 'delivery' && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{items.length} items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.wrapName}
                      </span>
                      <span>{formatCurrency(item.itemTotal * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8.5%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>$5.00</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(total + (deliveryType === 'delivery' ? 5 : 0))}
                  </span>
                </div>

                <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Processing...' : 'Pay Securely'}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
