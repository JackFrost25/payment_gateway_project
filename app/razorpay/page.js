'use client';

import { useState } from 'react';
import PaymentFlowDiagram from '@/components/PaymentFlowDiagram';
import CodeSnippet from '@/components/CodeSnippet';

const razorpaySteps = [
  { icon: '🛒', label: 'Order', desc: 'Create server-side' },
  { icon: '💻', label: 'Checkout', desc: 'Open Razorpay UI' },
  { icon: '💳', label: 'Payment', desc: 'Customer pays' },
  { icon: '🔐', label: 'Verify', desc: 'Signature check' },
  { icon: '✅', label: 'Capture', desc: 'Confirm payment' },
];

const createOrderCode = `<span class="code-comment">// Server-side: Create a Razorpay Order</span>
<span class="code-keyword">const</span> Razorpay = <span class="code-function">require</span>(<span class="code-string">'razorpay'</span>);

<span class="code-keyword">const</span> instance = <span class="code-keyword">new</span> <span class="code-function">Razorpay</span>({
  <span class="code-property">key_id</span>: process.env.RAZORPAY_KEY_ID,
  <span class="code-property">key_secret</span>: process.env.RAZORPAY_KEY_SECRET,
});

<span class="code-keyword">const</span> order = <span class="code-keyword">await</span> instance.orders.<span class="code-function">create</span>({
  <span class="code-property">amount</span>: <span class="code-number">50000</span>,  <span class="code-comment">// Amount in paise (₹500)</span>
  <span class="code-property">currency</span>: <span class="code-string">'INR'</span>,
  <span class="code-property">receipt</span>: <span class="code-string">'receipt_order_1'</span>,
  <span class="code-property">payment_capture</span>: <span class="code-number">1</span>  <span class="code-comment">// Auto capture</span>
});`;

const checkoutCode = `<span class="code-comment">// Client-side: Open Razorpay Checkout</span>
<span class="code-keyword">const</span> options = {
  <span class="code-property">key</span>: <span class="code-string">'rzp_test_your_key_id'</span>,
  <span class="code-property">amount</span>: order.amount,
  <span class="code-property">currency</span>: order.currency,
  <span class="code-property">name</span>: <span class="code-string">'Your Company'</span>,
  <span class="code-property">description</span>: <span class="code-string">'Payment for Order #123'</span>,
  <span class="code-property">order_id</span>: order.id,
  <span class="code-property">handler</span>: <span class="code-keyword">function</span>(response) {
    <span class="code-comment">// Send to server for verification</span>
    <span class="code-function">verifyPayment</span>({
      <span class="code-property">razorpay_order_id</span>: response.razorpay_order_id,
      <span class="code-property">razorpay_payment_id</span>: response.razorpay_payment_id,
      <span class="code-property">razorpay_signature</span>: response.razorpay_signature,
    });
  },
  <span class="code-property">prefill</span>: {
    <span class="code-property">name</span>: <span class="code-string">'Customer Name'</span>,
    <span class="code-property">email</span>: <span class="code-string">'customer@example.com'</span>,
  },
  <span class="code-property">theme</span>: { <span class="code-property">color</span>: <span class="code-string">'#0070f3'</span> }
};

<span class="code-keyword">const</span> rzp = <span class="code-keyword">new</span> <span class="code-function">Razorpay</span>(options);
rzp.<span class="code-function">open</span>();`;

const verifyCode = `<span class="code-comment">// Server-side: Verify Razorpay Payment Signature</span>
<span class="code-keyword">const</span> crypto = <span class="code-function">require</span>(<span class="code-string">'crypto'</span>);

<span class="code-keyword">const</span> body = razorpay_order_id + <span class="code-string">'|'</span> + razorpay_payment_id;

<span class="code-keyword">const</span> expectedSignature = crypto
  .<span class="code-function">createHmac</span>(<span class="code-string">'sha256'</span>, process.env.RAZORPAY_KEY_SECRET)
  .<span class="code-function">update</span>(body)
  .<span class="code-function">digest</span>(<span class="code-string">'hex'</span>);

<span class="code-keyword">const</span> isValid = expectedSignature === razorpay_signature;

<span class="code-keyword">if</span> (isValid) {
  <span class="code-comment">// Payment is genuine — update your database</span>
  console.<span class="code-function">log</span>(<span class="code-string">'Payment verified successfully!'</span>);
} <span class="code-keyword">else</span> {
  <span class="code-comment">// Payment is fraudulent — reject it</span>
  console.<span class="code-function">log</span>(<span class="code-string">'Payment verification failed!'</span>);
}`;

export default function RazorpayPage() {
  const [activeStep, setActiveStep] = useState(-1);
  const [formData, setFormData] = useState({
    amount: '500',
    currency: 'INR',
    name: '',
    email: '',
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus(null);
    setResponse(null);

    // Step 0: Create Order
    setActiveStep(0);
    await new Promise((r) => setTimeout(r, 1000));

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount) * 100,
          currency: formData.currency,
        }),
      });
      const orderData = await res.json();
      setResponse(orderData);

      // Step 1: Checkout
      setActiveStep(1);
      await new Promise((r) => setTimeout(r, 1000));

      // Step 2: Payment
      setActiveStep(2);
      await new Promise((r) => setTimeout(r, 1200));

      // Step 3: Verify
      setActiveStep(3);
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(2, 14),
          razorpay_signature: 'mock_signature_' + Date.now(),
        }),
      });
      const verifyData = await verifyRes.json();

      await new Promise((r) => setTimeout(r, 800));

      // Step 4: Complete
      setActiveStep(4);
      setPaymentStatus(verifyData.verified ? 'succeeded' : 'failed');
      setResponse(verifyData);
    } catch {
      setPaymentStatus('failed');
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏦 Razorpay Payment Gateway</h1>
        <p>Learn how Razorpay processes payments with order creation and signature verification</p>
      </div>

      {/* How It Works */}
      <div className="explainer-box animate-in">
        <h3>🔍 How Razorpay Payments Work</h3>
        <p style={{ marginBottom: 16 }}>
          Razorpay follows an <strong>order-first</strong> approach. You create an order on the 
          server, open the Razorpay checkout on the client, and verify the payment signature 
          on the server for security.
        </p>
        <ol className="explainer-steps">
          <li>
            <strong>Create an Order</strong> — Your server creates an order using Razorpay&apos;s API 
            with amount and currency. This returns an <code>order_id</code>.
          </li>
          <li>
            <strong>Open Checkout</strong> — The Razorpay checkout modal opens on the client 
            with the <code>order_id</code>. Customer selects payment method.
          </li>
          <li>
            <strong>Customer Pays</strong> — Customer completes payment via UPI, card, net banking, 
            or wallet. Razorpay handles the payment processing.
          </li>
          <li>
            <strong>Verify Signature</strong> — After payment, verify the HMAC-SHA256 signature 
            on your server. This ensures the payment wasn&apos;t tampered with.
          </li>
        </ol>
      </div>

      {/* Flow Diagram */}
      <div className="card mb-32 animate-in animate-in-delay-1">
        <h3 className="section-title">📊 Payment Flow Visualization</h3>
        <PaymentFlowDiagram steps={razorpaySteps} activeStep={activeStep} />
      </div>

      {/* Checkout Form + Response */}
      <div className="grid-2 mb-32">
        <div className="card animate-in animate-in-delay-2">
          <h3 className="section-title">🧪 Test Checkout</h3>
          <p className="section-subtitle">
            Simulate a Razorpay payment flow. The mock API will create an order 
            and verify the payment signature automatically.
          </p>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-razorpay btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" style={{ width: 18, height: 18 }}></span>
                  Processing...
                </>
              ) : (
                `Pay ${formData.currency === 'INR' ? '₹' : formData.currency === 'EUR' ? '€' : '$'}${formData.amount}`
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
                {paymentStatus === 'succeeded' ? 'Payment Verified!' : 'Verification Failed'}
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
                {paymentStatus === 'succeeded'
                  ? 'Signature verification passed. Payment is genuine.'
                  : 'Signature mismatch. Payment may be tampered with.'}
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
        <h2 className="section-title">💻 Real Razorpay Code Examples</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <CodeSnippet
            language="JavaScript"
            title="1. Create Order (Server)"
            code={createOrderCode}
          />
          <CodeSnippet
            language="JavaScript"
            title="2. Open Checkout (Client)"
            code={checkoutCode}
          />
          <CodeSnippet
            language="JavaScript"
            title="3. Verify Signature (Server)"
            code={verifyCode}
          />
        </div>
      </div>

      {/* Razorpay vs Stripe */}
      <div className="card mt-32">
        <h3 className="section-title">⚖️ Razorpay vs Stripe — Key Differences</h3>
        <div className="table-container" style={{ marginTop: 16, border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Razorpay</th>
                <th>Stripe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Primary Market</td>
                <td>India</td>
                <td>Global</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Checkout</td>
                <td>Pre-built modal popup</td>
                <td>Elements / Custom forms</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Payment Flow</td>
                <td>Order → Checkout → Verify</td>
                <td>Intent → Confirm → Webhook</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Verification</td>
                <td>HMAC-SHA256 signature</td>
                <td>Webhook signature</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>UPI Support</td>
                <td>Native</td>
                <td>Limited</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Amount Format</td>
                <td>Paise (× 100)</td>
                <td>Cents (× 100)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
