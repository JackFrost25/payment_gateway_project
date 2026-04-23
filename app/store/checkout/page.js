'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '@/components/StripeCheckoutForm';
import '../store.css';

// Initialize Stripe outside of component to avoid recreating
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CHECKOUT_STEPS = [
  { num: 1, label: 'Contact' },
  { num: 2, label: 'Address' },
  { num: 3, label: 'Payment' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, shipping, total, clearCart, setOrderData } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' });
  const [stripeClientSecret, setStripeClientSecret] = useState(null);

  if (items.length === 0) {
    return (
      <div>
        <div className="page-header"><h1>Checkout</h1></div>
        <div className="empty-state" style={{ padding: '80px 32px' }}>
          <div className="empty-state-icon">🛒</div>
          <h3>Nothing to checkout</h3>
          <p>Add items to your cart first</p>
        </div>
      </div>
    );
  }

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway: 'razorpay', amount: Math.round(total * 100), currency: 'INR', contact, address, items: items.map(i => ({ name: i.product.name, size: i.size, color: i.color, qty: i.quantity, price: i.product.price })) }),
      });
      const data = await res.json();

      if (data.useRazorpayLive && data.razorpayOrderId) {
        // Real Razorpay Checkout
        const options = {
          key: data.razorpayKeyId,
          amount: data.amount,
          currency: data.currency,
          name: 'NOIR Collection',
          description: `Order ${data.orderId}`,
          order_id: data.razorpayOrderId,
          prefill: { name: contact.name, email: contact.email, contact: contact.phone },
          theme: { color: '#6366f1' },
          handler: async function (response) {
            // Verify payment on server
            const verifyRes = await fetch('/api/store/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
                contact, address, items: items.map(i => ({ name: i.product.name, size: i.size, color: i.color, qty: i.quantity, price: i.product.price })),
                subtotal, tax, shipping, total,
              }),
            });
            const verifyData = await verifyRes.json();
            setOrderData(verifyData);
            clearCart();
            router.push('/store/order-confirmation');
          },
          modal: { ondismiss: () => setLoading(false) },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () { setLoading(false); alert('Payment failed. Please try again.'); });
        rzp.open();
      } else {
        // Mock fallback
        simulateMockPayment('razorpay', data);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway: 'stripe', amount: Math.round(total * 100), currency: 'INR', contact, address, items: items.map(i => ({ name: i.product.name, size: i.size, color: i.color, qty: i.quantity, price: i.product.price })) }),
      });
      const data = await res.json();

      if (data.useStripeLive && data.clientSecret) {
        setStripeClientSecret(data.clientSecret);
        setLoading(false);
      } else {
        // Mock fallback
        simulateMockPayment('stripe', data);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong starting Stripe checkout. Please try again.');
      setLoading(false);
    }
  };

  const simulateMockPayment = async (gateway, data) => {
    const orderResult = {
      orderId: data?.orderId || 'ORD-' + Date.now(),
      transactionId: data?.transactionId || 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'success',
      gateway,
      amount: total,
      currency: 'INR',
      contact, address,
      items: items.map(i => ({ name: i.product.name, size: i.size, color: i.color, qty: i.quantity, price: i.product.price, total: i.product.price * i.quantity })),
      subtotal, tax, shipping, total,
      timestamp: new Date().toISOString(),
      paymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 18),
    };
    setOrderData(orderResult);
    clearCart();
    router.push('/store/order-confirmation');
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') handleRazorpayPayment();
    else handleStripePayment();
  };

  const handleStripeSuccess = (paymentIntent) => {
    const orderResult = {
      orderId: paymentIntent.metadata?.orderId || 'ORD-' + Date.now(),
      transactionId: paymentIntent.id,
      status: 'success',
      gateway: 'stripe',
      amount: total,
      currency: 'INR',
      contact, address,
      items: items.map(i => ({ name: i.product.name, size: i.size, color: i.color, qty: i.quantity, price: i.product.price, total: i.product.price * i.quantity })),
      subtotal, tax, shipping, total,
      timestamp: new Date().toISOString(),
      paymentId: paymentIntent.id,
    };
    setOrderData(orderResult);
    clearCart();
    router.push('/store/order-confirmation');
  };

  // If Stripe Elements is rendering, hijack the UI layout
  if (stripeClientSecret) {
    const appearance = {
      theme: 'night',
      variables: { colorPrimary: '#6366f1' },
    };

    return (
      <div className="card animate-in" style={{ maxWidth: 600, margin: '40px auto', padding: 32 }}>
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Complete Payment via Stripe</h2>
        <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance }}>
          <StripeCheckoutForm 
            total={total}
            onSuccess={handleStripeSuccess}
            onCancel={() => setStripeClientSecret(null)}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header"><h1>🛍️ Checkout</h1><p>Complete your order securely</p></div>

      {/* Progress */}
      <div className="checkout-progress">
        {CHECKOUT_STEPS.map((s, idx) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: idx < CHECKOUT_STEPS.length - 1 ? 1 : 0 }}>
            <div className={`checkout-step-indicator ${step === s.num ? 'active' : step > s.num ? 'complete' : ''}`}>
              <div className="checkout-step-num">{step > s.num ? '✓' : s.num}</div>
              <div className="checkout-step-label">{s.label}</div>
            </div>
            {idx < CHECKOUT_STEPS.length - 1 && <div className={`checkout-step-line ${step > s.num ? 'complete' : ''}`} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
        <div>
          {/* Step 1: Contact */}
          {step === 1 && (
            <div className="checkout-section animate-in">
              <h3>📱 Contact Information</h3>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 20 }}>We&apos;ll use this to send your order updates</p>
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Your full name" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Email Address *</label><input className="form-input" type="email" placeholder="you@example.com" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Phone Number *</label><input className="form-input" type="tel" placeholder="+91 98765 43210" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} /></div>
              </div>
              <button className="btn btn-primary btn-lg mt-16" onClick={() => { if (!contact.name || !contact.email || !contact.phone) { alert('Please fill all fields'); return; } setStep(2); }} style={{ width: '100%' }}>Continue to Address →</button>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="checkout-section animate-in">
              <h3>📦 Shipping Address</h3>
              <div className="form-group"><label className="form-label">Address Line 1 *</label><input className="form-input" placeholder="Street address" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Address Line 2</label><input className="form-input" placeholder="Apartment, suite, etc." value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} /></div>
              <div className="form-row-3">
                <div className="form-group"><label className="form-label">City *</label><input className="form-input" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">State *</label><input className="form-input" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">PIN Code *</label><input className="form-input" placeholder="400001" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Country</label><input className="form-input" value={address.country} disabled /></div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => { if (!address.line1 || !address.city || !address.state || !address.pincode) { alert('Please fill required fields'); return; } setStep(3); }}>Continue to Payment →</button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="checkout-section animate-in">
              <h3>💳 Payment Method</h3>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 20 }}>Choose your preferred payment gateway</p>
              <div className="payment-method-grid">
                <div className={`payment-method-card ${paymentMethod === 'razorpay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('razorpay')}>
                  <div className="payment-method-icon">🏦</div>
                  <h4>Razorpay</h4>
                  <p>UPI, Cards, Net Banking, Wallets</p>
                  <div style={{ marginTop: 8 }}><span className="badge success"><span className="badge-dot"></span>Live API</span></div>
                </div>
                <div className={`payment-method-card ${paymentMethod === 'stripe' ? 'selected' : ''}`} onClick={() => setPaymentMethod('stripe')}>
                  <div className="payment-method-icon">💳</div>
                  <h4>Stripe</h4>
                  <p>Credit/Debit Cards</p>
                  <div style={{ marginTop: 8 }}><span className="badge warning"><span className="badge-dot"></span>Mock Mode</span></div>
                </div>
              </div>

              {paymentMethod === 'razorpay' && (
                <div style={{ padding: 16, background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>🔐 Razorpay secure checkout will open in a popup. You can pay via UPI, cards, net banking, or wallets.</p>
                </div>
              )}

              <div style={{ padding: 20, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📋 Order Review</h4>
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-primary)', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.product.name} × {item.quantity} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({item.size}, {item.color})</span></span>
                    <span style={{ fontWeight: 600 }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary btn-lg" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handlePayment} disabled={loading}>
                  {loading ? (<><span className="loading-spinner" style={{ width: 18, height: 18 }}></span> Processing...</>) : `Pay ₹${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="order-summary">
          <h3>🧾 Order Summary</h3>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: 'white', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.size} · {item.color} · ×{item.quantity}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>₹{(item.product.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border-primary)', marginTop: 12, paddingTop: 12 }}>
            <div className="order-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="order-summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="order-summary-row"><span>Shipping</span><span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="order-summary-row total"><span>Total</span><span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>🔒 Secure & encrypted checkout</div>
        </div>
      </div>
    </div>
  );
}
