import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { amount } = body;

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  const paymentIntentId = 'pi_' + Math.random().toString(36).substring(2, 26);
  const clientSecret = paymentIntentId + '_secret_' + Math.random().toString(36).substring(2, 14);

  return NextResponse.json({
    paymentIntentId,
    clientSecret,
    amount: amount || 2999,
    currency: 'usd',
    status: 'requires_confirmation',
    created: new Date().toISOString(),
    livemode: false,
    description: 'Mock Stripe Payment Intent — this simulates the real Stripe API response.',
  });
}
