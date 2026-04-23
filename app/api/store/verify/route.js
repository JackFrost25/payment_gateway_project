import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  const body = await request.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    contact,
    address,
    items,
    subtotal,
    tax,
    shipping,
    total,
  } = body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  let verified = false;

  if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
    // Real signature verification
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    verified = generatedSignature === razorpay_signature;
  } else {
    // Mock verification
    verified = true;
  }

  if (!verified) {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  return NextResponse.json({
    orderId: orderId || 'ORD-' + Date.now(),
    transactionId: razorpay_payment_id || 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    paymentId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
    status: 'success',
    gateway: 'razorpay',
    verified: true,
    contact,
    address,
    items: items?.map((i) => ({ ...i, total: i.price * i.qty })),
    subtotal,
    tax,
    shipping,
    total,
    amount: total,
    currency: 'INR',
    timestamp: new Date().toISOString(),
  });
}
