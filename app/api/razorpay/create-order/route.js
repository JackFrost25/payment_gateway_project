import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { amount, currency } = body;

  await new Promise((r) => setTimeout(r, 500));

  const orderId = 'order_' + Math.random().toString(36).substring(2, 18);

  return NextResponse.json({
    orderId,
    amount: amount || 50000,
    currency: currency || 'INR',
    receipt: 'receipt_' + Date.now(),
    status: 'created',
    created_at: new Date().toISOString(),
    description: 'Mock Razorpay order — in production, this comes from razorpay.orders.create()',
  });
}
