import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function StripeCheckoutForm({ total, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/store/order-confirmation`,
      },
      redirect: 'if_required', // Avoid redirect if we want to handle success in-page
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    } else {
      setMessage('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', padding: '16px 0' }}>
      <PaymentElement />
      
      {message && <div style={{ color: 'var(--error)', marginTop: 12, fontSize: 14 }}>{message}</div>}
      
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary btn-lg" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-stripe btn-lg" style={{ flex: 1 }} disabled={!stripe || loading}>
          {loading ? (
            <><span className="loading-spinner" style={{ width: 18, height: 18 }}></span> Processing...</>
          ) : (
            `Pay ₹${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
          )}
        </button>
      </div>
    </form>
  );
}
