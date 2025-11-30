'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/format';

interface PriceDisplayProps {
  basePrice: number;
  ingredientsTotal: number;
  addOnsTotal: number;
  subtotal: number;
  tax: number;
  total: number;
  baseName?: string;
}

export function PriceDisplay({
  basePrice,
  ingredientsTotal,
  addOnsTotal,
  subtotal,
  tax,
  total,
  baseName,
}: PriceDisplayProps) {
  return (
    <Card className="sticky top-20 z-10">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {baseName || 'Base'}
            </span>
            <span>{formatCurrency(basePrice)}</span>
          </div>

          {ingredientsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ingredients</span>
              <span>+{formatCurrency(ingredientsTotal)}</span>
            </div>
          )}

          {addOnsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sauces & Extras</span>
              <span>+{formatCurrency(addOnsTotal)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8.5%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
