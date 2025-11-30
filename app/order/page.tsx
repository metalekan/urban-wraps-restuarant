'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Wrap, Ingredient, AddOn } from '@/lib/firebase/firestore-schema';
import { useOrderBuilder } from '@/lib/hooks/useOrderBuilder';
import { useCart } from '@/lib/contexts/CartContext';
import { Header } from '@/components/layout/Header';
import { BaseSelector } from '@/components/order-builder/BaseSelector';
import { IngredientSelector } from '@/components/order-builder/IngredientSelector';
import { AddOnSelector } from '@/components/order-builder/AddOnSelector';
import { PriceDisplay } from '@/components/order-builder/PriceDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShoppingCart, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { generateCartItemId } from '@/lib/utils/format';

export default function OrderPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const orderBuilder = useOrderBuilder();

  const [wraps, setWraps] = useState<Wrap[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Fetch menu data from Firestore
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Fetch wraps
        const wrapsQuery = query(collection(db, 'wraps'), where('status', '==', 'active'));
        const wrapsSnapshot = await getDocs(wrapsQuery);
        const wrapsData = wrapsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Wrap[];

        // Fetch ingredients
        const ingredientsQuery = query(
          collection(db, 'ingredients'),
          where('status', '==', 'active')
        );
        const ingredientsSnapshot = await getDocs(ingredientsQuery);
        const ingredientsData = ingredientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ingredient[];

        // Fetch add-ons
        const addOnsQuery = query(collection(db, 'addOns'), where('status', '==', 'active'));
        const addOnsSnapshot = await getDocs(addOnsQuery);
        const addOnsData = addOnsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AddOn[];

        setWraps(wrapsData);
        setIngredients(ingredientsData);
        setAddOns(addOnsData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast.error('Failed to load menu. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleAddToCart = () => {
    if (!orderBuilder.canAddToCart()) {
      toast.error('Please select a base and at least one ingredient');
      return;
    }

    const cartItem = {
      wrapId: orderBuilder.selectedWrap!.id,
      wrapName: orderBuilder.selectedWrap!.name,
      basePrice: orderBuilder.selectedWrap!.basePrice,
      ingredients: orderBuilder.selectedIngredients,
      addOns: orderBuilder.selectedAddOns,
      quantity,
      itemTotal: orderBuilder.total,
    };

    addToCart(cartItem);
    orderBuilder.reset();
    setQuantity(1);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show message if no menu data
  if (wraps.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container max-w-7xl mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Menu Not Available</h1>
          <p className="text-muted-foreground mb-8">
            Our menu is being updated. Please check back soon!
          </p>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Build Your Perfect Wrap</h1>
          <p className="text-lg text-muted-foreground">
            Customize every detail of your meal
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Builder */}
          <div className="lg:col-span-2 space-y-8">
            {/* Base Selection */}
            <BaseSelector
              wraps={wraps}
              selectedWrap={orderBuilder.selectedWrap}
              onSelectWrap={orderBuilder.selectWrap}
            />

            {/* Ingredient Selection */}
            {orderBuilder.selectedWrap && (
              <IngredientSelector
                ingredients={ingredients}
                selectedIngredients={orderBuilder.selectedIngredients.map((i) => i.id)}
                onToggleIngredient={orderBuilder.toggleIngredient}
                maxIngredients={orderBuilder.MAX_INGREDIENTS}
                maxProteins={orderBuilder.MAX_PROTEINS}
                proteinCount={orderBuilder.getProteinCount()}
              />
            )}

            {/* Add-On Selection */}
            {orderBuilder.selectedWrap && orderBuilder.selectedIngredients.length > 0 && (
              <AddOnSelector
                addOns={addOns}
                selectedAddOns={orderBuilder.selectedAddOns.map((a) => a.id)}
                onToggleAddOn={orderBuilder.toggleAddOn}
              />
            )}
          </div>

          {/* Price Summary & Actions */}
          <div className="space-y-4">
            <PriceDisplay
              basePrice={orderBuilder.basePrice}
              ingredientsTotal={orderBuilder.ingredientsTotal}
              addOnsTotal={orderBuilder.addOnsTotal}
              subtotal={orderBuilder.subtotal}
              tax={orderBuilder.tax}
              total={orderBuilder.total}
              baseName={orderBuilder.selectedWrap?.name}
            />

            {/* Action Buttons */}
            <Card className="">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(20, quantity + 1))}
                      disabled={quantity >= 20}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!orderBuilder.canAddToCart()}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={orderBuilder.reset}
                  disabled={!orderBuilder.selectedWrap}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleViewCart}
                >
                  View Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
