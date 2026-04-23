import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { paymentIntentId, cardNumber } = body;

  await new Promise((r) => setTimeout(r, 600));

  // Card 4000 0000 0000 0002 = decline, everything else = success
  const isDeclined = cardNumber && cardNumber.replace(/\s/g, '') === '4000000000000002';

  if (isDeclined) {
    return NextResponse.json({
      status: 'failed',
      paymentIntentId,
      error: { code: 'card_declined', message: 'Your card was declined.', type: 'card_error' },
      description: 'This simulates a card decline. In production, Stripe returns a card_error.',
    });
  }

  return NextResponse.json({
    status: 'succeeded',
    paymentIntentId,
    amount_received: 2999,
    currency: 'usd',
    payment_method: 'pm_' + Math.random().toString(36).substring(2, 18),
    receipt_url: 'https://pay.stripe.com/receipts/mock_receipt',
    description: 'Mock confirmation — in production this comes from stripe.paymentIntents.confirm()',
  });
}
