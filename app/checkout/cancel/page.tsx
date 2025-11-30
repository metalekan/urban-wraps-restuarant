'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container max-w-3xl mx-auto py-20 px-4">
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <XCircle className="h-24 w-24 text-destructive" />
            </div>
            
            <h1 className="text-4xl font-bold text-destructive">Payment Cancelled</h1>
            
            <p className="text-xl text-muted-foreground">
              Your payment was cancelled and no charges were made.
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Link href="/cart">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Return to Cart
                </Button>
              </Link>
              <Link href="/checkout">
                <Button>Try Again</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
