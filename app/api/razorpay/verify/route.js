import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  await new Promise((r) => setTimeout(r, 400));

  // In production: HMAC-SHA256(order_id + "|" + payment_id, secret)
  // Here we always verify as true for the mock
  return NextResponse.json({
    verified: true,
    razorpay_order_id,
    razorpay_payment_id,
    status: 'captured',
    method: 'mock_upi',
    description: 'Mock verification — in production, you compute HMAC-SHA256 of order_id|payment_id using your key_secret and compare with the signature.',
    signature_formula: 'HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)',
  });
}
