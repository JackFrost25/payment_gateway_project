import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { amount, currency, contact, items, gateway } = body;

  const orderId = 'ORD-' + Date.now();
  const transactionId = 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // --- STRIPE INTEGRATION ---
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (gateway === 'stripe' && stripeSecretKey && !stripeSecretKey.startsWith('sk_test_your_key')) {
    try {
      const stripe = require('stripe')(stripeSecretKey);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: (currency || 'inr').toLowerCase(),
        description: `Order ${orderId}`,
        metadata: {
          orderId,
          customerName: contact?.name || '',
          customerEmail: contact?.email || '',
        },
      });

      return NextResponse.json({
        useStripeLive: true,
        clientSecret: paymentIntent.client_secret,
        orderId,
        transactionId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'created',
      });
    } catch (err) {
      console.error('Stripe PaymentIntent creation failed:', err);
      // Fall through to mock
    }
  }

  // --- RAZORPAY INTEGRATION ---
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (gateway === 'razorpay' && keyId && keySecret && !keyId.startsWith('rzp_placeholder')) {
    try {
      const Razorpay = (await import('razorpay')).default;
      const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

      const razorpayOrder = await instance.orders.create({
        amount: amount,
        currency: currency || 'INR',
        receipt: orderId,
        notes: {
           customer_name: contact?.name || '',
           customer_email: contact?.email || '',
           items_count: items?.length || 0,
        },
      });

      return NextResponse.json({
        useRazorpayLive: true,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: keyId,
        orderId,
        transactionId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        status: 'created',
      });
    } catch (err) {
      console.error('Razorpay order creation failed:', err);
      // Fall through to mock
    }
  }

  // --- MOCK FALLBACK ---
  await new Promise((r) => setTimeout(r, 800));

  return NextResponse.json({
    useRazorpayLive: false,
    useStripeLive: false,
    orderId,
    transactionId,
    amount: amount || 0,
    currency: currency || 'INR',
    status: 'created',
    mock: true,
    message: 'Using mock mode. Set API Keys in .env.local for live payments.',
  });
}
