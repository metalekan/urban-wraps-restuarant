'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart, isInitialized } = useCart();

  useEffect(() => {
    if (sessionId && isInitialized) {
      clearCart();
      // Trigger fireworks or some celebration
    }
  }, [sessionId, clearCart, isInitialized]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container max-w-3xl mx-auto py-20 px-4">
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-24 w-24 text-green-500" />
            </div>
            
            <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>
            
            <p className="text-xl text-muted-foreground">
              Thank you for your order. We've received it and will start preparing it shortly.
            </p>

            <div className="p-4 bg-muted rounded-lg max-w-md mx-auto">
              <p className="text-sm font-medium">Order Reference</p>
              <p className="text-xs text-muted-foreground break-all">{sessionId}</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link href="/dashboard/orders">
                <Button variant="outline">View My Orders</Button>
              </Link>
              <Link href="/order">
                <Button>
                  Order Again <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
