'use client';

import { useState } from 'react';
import PaymentFlowDiagram from '@/components/PaymentFlowDiagram';
import CodeSnippet from '@/components/CodeSnippet';

const stripeSteps = [
  { icon: '🛒', label: 'Customer', desc: 'Fills checkout' },
  { icon: '🔑', label: 'Create Intent', desc: 'Server-side' },
  { icon: '💳', label: 'Confirm', desc: 'Client-side' },
  { icon: '🏦', label: 'Process', desc: 'Stripe API' },
  { icon: '✅', label: 'Complete', desc: 'Webhook' },
];

const createIntentCode = `<span class="code-comment">// Server-side: Create a Payment Intent</span>
<span class="code-keyword">const</span> stripe = <span class="code-function">require</span>(<span class="code-string">'stripe'</span>)(process.env.STRIPE_SECRET_KEY);

<span class="code-keyword">const</span> paymentIntent = <span class="code-keyword">await</span> stripe.paymentIntents.<span class="code-function">create</span>({
  <span class="code-property">amount</span>: <span class="code-number">2999</span>, <span class="code-comment">// Amount in cents ($29.99)</span>
  <span class="code-property">currency</span>: <span class="code-string">'usd'</span>,
  <span class="code-property">payment_method_types</span>: [<span class="code-string">'card'</span>],
  <span class="code-property">metadata</span>: { <span class="code-property">order_id</span>: <span class="code-string">'order_123'</span> }
});

<span class="code-comment">// Send the client_secret to the frontend</span>
res.<span class="code-function">json</span>({ <span class="code-property">clientSecret</span>: paymentIntent.client_secret });`;

const confirmCode = `<span class="code-comment">// Client-side: Confirm payment with Stripe.js</span>
<span class="code-keyword">const</span> { error, paymentIntent } = <span class="code-keyword">await</span> stripe.<span class="code-function">confirmCardPayment</span>(
  clientSecret,
  {
    <span class="code-property">payment_method</span>: {
      <span class="code-property">card</span>: cardElement,
      <span class="code-property">billing_details</span>: { <span class="code-property">name</span>: <span class="code-string">'Customer Name'</span> }
    }
  }
);

<span class="code-keyword">if</span> (error) {
  console.<span class="code-function">log</span>(error.message);
} <span class="code-keyword">else if</span> (paymentIntent.status === <span class="code-string">'succeeded'</span>) {
  console.<span class="code-function">log</span>(<span class="code-string">'Payment successful!'</span>);
}`;

const webhookCode = `<span class="code-comment">// Server-side: Handle Stripe Webhooks</span>
<span class="code-keyword">const</span> endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

<span class="code-keyword">const</span> event = stripe.webhooks.<span class="code-function">constructEvent</span>(
  req.body, sig, endpointSecret
);

<span class="code-keyword">switch</span> (event.type) {
  <span class="code-keyword">case</span> <span class="code-string">'payment_intent.succeeded'</span>:
    <span class="code-comment">// Update order status in your database</span>
    <span class="code-keyword">break</span>;
  <span class="code-keyword">case</span> <span class="code-string">'payment_intent.payment_failed'</span>:
    <span class="code-comment">// Notify customer of failure</span>
    <span class="code-keyword">break</span>;
}`;

export default function StripePage() {
  const [activeStep, setActiveStep] = useState(-1);
  const [formData, setFormData] = useState({
    amount: '29.99',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus(null);
    setResponse(null);

    // Step 1: Creating intent
    setActiveStep(1);
    await new Promise((r) => setTimeout(r, 1200));

    // Call mock API
    try {
      const res = await fetch('/api/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(formData.amount) * 100 }),
      });
      const data = await res.json();
      setResponse(data);

      // Step 2: Confirming
      setActiveStep(2);
      await new Promise((r) => setTimeout(r, 1000));

      // Step 3: Processing
      setActiveStep(3);
      const confirmRes = await fetch('/api/stripe/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: data.paymentIntentId,
          cardNumber: formData.cardNumber || '4242424242424242',
        }),
      });
      const confirmData = await confirmRes.json();

      await new Promise((r) => setTimeout(r, 800));

      // Step 4: Complete
      setActiveStep(4);
      setPaymentStatus(confirmData.status);
      setResponse(confirmData);
    } catch {
      setPaymentStatus('failed');
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>💳 Stripe Payment Gateway</h1>
        <p>Learn how Stripe processes payments using the Payment Intents API</p>
      </div>

      {/* How It Works */}
      <div className="explainer-box animate-in">
        <h3>🔍 How Stripe Payments Work</h3>
        <p style={{ marginBottom: 16 }}>
          Stripe uses the <strong>Payment Intents API</strong> to handle complex payment flows 
          including 3D Secure authentication, multi-step payments, and automatic retries.
        </p>
        <ol className="explainer-steps">
          <li>
            <strong>Create a Payment Intent</strong> — Your server calls Stripe&apos;s API with the amount 
            and currency. Stripe returns a <code>client_secret</code>.
          </li>
          <li>
            <strong>Collect Card Details</strong> — Using Stripe.js and Elements, the card details 
            are securely collected without touching your server (PCI compliant).
          </li>
          <li>
            <strong>Confirm the Payment</strong> — The client confirms the payment using the 
            <code>client_secret</code>. Stripe handles 3DS if required.
          </li>
          <li>
            <strong>Handle the Result</strong> — Stripe sends a webhook notification confirming 
            success or failure. Always verify on the server side!
          </li>
        </ol>
      </div>

      {/* Flow Diagram */}
      <div className="card mb-32 animate-in animate-in-delay-1">
        <h3 className="section-title">📊 Payment Flow Visualization</h3>
        <PaymentFlowDiagram steps={stripeSteps} activeStep={activeStep} />
      </div>

      {/* Checkout Form + Response */}
      <div className="grid-2 mb-32">
        <div className="card animate-in animate-in-delay-2">
          <h3 className="section-title">🧪 Test Checkout</h3>
          <p className="section-subtitle">
            Try a simulated Stripe payment. Use test card <code>4242 4242 4242 4242</code> for 
            success or <code>4000 0000 0000 0002</code> for decline.
          </p>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <input
                type="text"
                className="form-input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <div className="card-input-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="4242 4242 4242 4242"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  maxLength={19}
                />
                <span className="card-input-icon">💳</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiry</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">CVC</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="123"
                  value={formData.cvc}
                  onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                  maxLength={4}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-stripe btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" style={{ width: 18, height: 18 }}></span>
                  Processing...
                </>
              ) : (
                `Pay $${formData.amount}`
              )}
            </button>
          </form>
        </div>

        <div className="card animate-in animate-in-delay-3">
          <h3 className="section-title">📡 API Response</h3>
          {paymentStatus && (
            <div className="payment-status-anim mb-24">
              <div className={`payment-status-icon ${paymentStatus === 'succeeded' ? 'success' : 'error'}`}>
                {paymentStatus === 'succeeded' ? '✓' : '✕'}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                {paymentStatus === 'succeeded' ? 'Payment Successful!' : 'Payment Failed'}
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
                {paymentStatus === 'succeeded'
                  ? 'The mock payment was processed successfully.'
                  : 'The card was declined. Try using 4242 4242 4242 4242.'}
              </p>
            </div>
          )}

          {response ? (
            <div className="code-block">
              <div className="code-block-header">
                <span className="code-block-lang">JSON</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mock Response</span>
              </div>
              <div className="code-block-body">
                <pre style={{ fontSize: 12 }}>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📡</div>
              <h3>No Response Yet</h3>
              <p>Submit a test payment to see the API response here</p>
            </div>
          )}
        </div>
      </div>

      {/* Code Examples */}
      <div className="section">
        <h2 className="section-title">💻 Real Stripe Code Examples</h2>
        <p className="section-subtitle">
          These are the actual API calls you would make in a production Stripe integration.
          Study them to understand the server-client flow.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <CodeSnippet
            language="JavaScript"
            title="1. Create Payment Intent (Server)"
            code={createIntentCode}
          />
          <CodeSnippet
            language="JavaScript"
            title="2. Confirm Payment (Client)"
            code={confirmCode}
          />
          <CodeSnippet
            language="JavaScript"
            title="3. Handle Webhooks (Server)"
            code={webhookCode}
          />
        </div>
      </div>

      {/* Key Concepts */}
      <div className="card mt-32">
        <h3 className="section-title">📚 Stripe Key Concepts</h3>
        <div className="grid-3" style={{ marginTop: 16 }}>
          <div style={{ padding: 20, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--accent-blue-light)' }}>🔐 Payment Intent</h4>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
              Represents the lifecycle of a payment. Created server-side, confirmed client-side. 
              Tracks the payment from creation to completion.
            </p>
          </div>
          <div style={{ padding: 20, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--accent-purple)' }}>🔑 Client Secret</h4>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
              A unique key tied to each Payment Intent. Passed to the frontend to confirm 
              the payment without exposing the secret key.
            </p>
          </div>
          <div style={{ padding: 20, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--accent-cyan)' }}>🪝 Webhooks</h4>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
              Server-to-server notifications. Stripe sends event data to your endpoint 
              when payment status changes. Always verify the signature!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
