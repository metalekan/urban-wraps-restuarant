import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '@/lib/firebase/admin-config';
import { CartItem } from '@/lib/firebase/firestore-schema';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover', // Use the latest API version or the one matching your types
});

export async function POST(request: Request) {
  try {
    const { items, userId, userEmail, deliveryType, address, orderId } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => {
      // Create a description string for ingredients and add-ons
      const description = [
        ...item.ingredients.map((i) => i.name),
        ...item.addOns.map((a) => a.name),
      ].join(', ');

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.wrapName,
            description: description.substring(0, 500), // Stripe has a limit
            images: [], // You can add image URLs here if you have them
          },
          unit_amount: Math.round(item.itemTotal * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    // Add tax as a line item (simplified for now, ideally Stripe Tax should be used)
    // For this MVP, we'll just let Stripe calculate the total based on line items
    // If you want to enforce your specific tax calculation, you'd need to add a custom tax item
    // or use Stripe Tax. For now, let's rely on the subtotal + tax logic in the frontend
    // matching what we send to Stripe.
    // Actually, to be precise, we should send the exact amount we want to charge.
    // But Stripe Checkout calculates totals based on line items.
    // Let's stick to line items for the products.
    // If we need to collect tax, we can add a "Tax" line item or configure Stripe Tax.
    // For simplicity in this MVP, we will add a separate line item for Tax if needed,
    // but usually it's better to let Stripe handle tax or include it in the price.
    // Let's assume the prices passed in `itemTotal` include everything or we add a tax item.
    
    // Better approach for MVP: Add a generic "Tax" line item to match our frontend calculation
    // Calculate total tax from the request (you might want to recalculate on server for security)
    const subtotal = items.reduce((sum: number, item: CartItem) => sum + item.itemTotal * item.quantity, 0);
    const taxAmount = Math.round(subtotal * 0.085 * 100); // 8.5% tax in cents

    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sales Tax (8.5%)',
          },
          unit_amount: taxAmount,
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: userEmail,
      metadata: {
        userId,
        deliveryType,
        address: JSON.stringify(address),
        // Store item IDs to reconstruct order later if needed
        itemIds: JSON.stringify(items.map((i: CartItem) => i.id)),
        orderId, // Store the Firestore Order ID
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
