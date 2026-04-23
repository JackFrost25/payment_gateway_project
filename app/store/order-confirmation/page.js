'use client';

import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InvoicePreview from '@/components/InvoicePreview';
import '../store.css';

export default function OrderConfirmationPage() {
  const { orderData } = useCart();
  const router = useRouter();
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!orderData) router.push('/store');
  }, [orderData, router]);

  if (!orderData) return null;

  const invoiceData = {
    id: orderData.orderId,
    customer: orderData.contact?.name || 'Customer',
    email: orderData.contact?.email || '',
    issueDate: orderData.timestamp,
    dueDate: orderData.timestamp,
    items: orderData.items?.map(i => ({
      description: `${i.name} (${i.size}, ${i.color})`,
      quantity: i.qty,
      unitPrice: i.price,
      total: i.total || i.price * i.qty,
    })) || [],
    tax: orderData.tax || 0,
    total: orderData.total || 0,
  };

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const handleDownloadPDF = async () => {
    try {
      setShowInvoice(true); // Ensure it's shown before capturing
      // Give React a tick to render
      setTimeout(async () => {
        const element = document.getElementById('invoice-preview');
        if (!element) return;
        
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
          margin: 10,
          filename: `Invoice-${orderData.orderId}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
      }, 500);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailStatus(null);
    try {
      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: orderData.contact?.email, 
          orderId: orderData.orderId,
          pdfData: 'mock_pdf_base64_data' 
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus({ type: 'success', text: data.message });
      } else {
        setEmailStatus({ type: 'error', text: data.error || 'Failed to send' });
      }
    } catch (err) {
      setEmailStatus({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSendingEmail(false);
      setTimeout(() => setEmailStatus(null), 5000); // clear after 5s
    }
  };

  return (
    <div>
      <div className="page-header"><h1>✅ Order Confirmed!</h1></div>
      
      {emailStatus && (
        <div className={`mb-32 p-16 border rounded ${
          emailStatus.type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'
        }`} style={{ padding: '16px', borderRadius: '8px', border: '1px solid', backgroundColor: emailStatus.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)', color: emailStatus.type === 'success' ? 'var(--success)' : 'var(--error)' }}>
          {emailStatus.text}
        </div>
      )}

      {/* Success Animation */}
      <div className="card mb-32 animate-in">
        <div className="order-success">
          <div className="order-success-check">✓</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Thank you for your order!</h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Your payment was processed successfully via <strong>{orderData.gateway === 'razorpay' ? 'Razorpay' : 'Stripe'}</strong>.
            Here are your complete transaction details.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="order-details-grid">
          <div className="order-detail-item">
            <div className="order-detail-label">Order ID</div>
            <div className="order-detail-value" style={{ fontFamily: 'monospace' }}>{orderData.orderId}</div>
          </div>
          <div className="order-detail-item">
            <div className="order-detail-label">Transaction ID</div>
            <div className="order-detail-value" style={{ fontFamily: 'monospace', fontSize: 14 }}>{orderData.transactionId || orderData.paymentId}</div>
          </div>
          <div className="order-detail-item">
            <div className="order-detail-label">Payment Gateway</div>
            <div className="order-detail-value">{orderData.gateway === 'razorpay' ? '🏦 Razorpay' : '💳 Stripe'}</div>
          </div>
          <div className="order-detail-item">
            <div className="order-detail-label">Status</div>
            <div className="order-detail-value" style={{ color: 'var(--success)' }}>✅ {orderData.status === 'success' ? 'Paid' : orderData.status}</div>
          </div>
          <div className="order-detail-item">
            <div className="order-detail-label">Amount Paid</div>
            <div className="order-detail-value" style={{ fontSize: 22 }}>₹{orderData.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="order-detail-item">
            <div className="order-detail-label">Date & Time</div>
            <div className="order-detail-value" style={{ fontSize: 14 }}>{new Date(orderData.timestamp).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'medium' })}</div>
          </div>
        </div>
      </div>

      {/* Customer & Shipping */}
      <div className="grid-2 mb-32">
        <div className="card animate-in animate-in-delay-1">
          <h3 className="section-title">📱 Contact Information</h3>
          <div style={{ fontSize: 14, lineHeight: 2, color: 'var(--text-secondary)' }}>
            <div><strong>Name:</strong> {orderData.contact?.name}</div>
            <div><strong>Email:</strong> {orderData.contact?.email}</div>
            <div><strong>Phone:</strong> {orderData.contact?.phone}</div>
          </div>
        </div>
        <div className="card animate-in animate-in-delay-2">
          <h3 className="section-title">📦 Shipping Address</h3>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <div>{orderData.address?.line1}</div>
            {orderData.address?.line2 && <div>{orderData.address.line2}</div>}
            <div>{orderData.address?.city}, {orderData.address?.state} {orderData.address?.pincode}</div>
            <div>{orderData.address?.country}</div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-32 animate-in animate-in-delay-3">
        <h3 className="section-title">🛍️ Items Ordered</h3>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead><tr><th>Product</th><th>Size</th><th>Color</th><th style={{ textAlign: 'center' }}>Qty</th><th style={{ textAlign: 'right' }}>Price</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
            <tbody>
              {orderData.items?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td style={{ textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>₹{item.price?.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{(item.total || item.price * item.qty)?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <div style={{ width: 280 }}>
            <div className="order-summary-row"><span>Subtotal</span><span>₹{orderData.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="order-summary-row"><span>GST (18%)</span><span>₹{orderData.tax?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="order-summary-row"><span>Shipping</span><span>{orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping}`}</span></div>
            <div className="order-summary-row total"><span>Total Paid</span><span>₹{orderData.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <div className="flex-between mb-16">
        <h2 className="section-title" style={{ marginBottom: 0 }}>📄 Invoice</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setShowInvoice(!showInvoice)}>{showInvoice ? 'Hide' : 'View'} Invoice</button>
          <button className="btn btn-secondary" onClick={handleDownloadPDF}>⬇️ Download PDF</button>
          <button className="btn btn-primary" onClick={handleSendEmail} disabled={sendingEmail}>
            {sendingEmail ? 'Sending...' : '📧 Send to Email'}
          </button>
        </div>
      </div>

      {showInvoice && (
        <div className="animate-in mb-32">
          <div id="invoice-preview">
            <InvoicePreview invoice={invoiceData} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '32px 0' }}>
        <button className="btn btn-primary btn-lg" onClick={() => router.push('/store')}>🛍️ Continue Shopping</button>
        <button className="btn btn-secondary btn-lg" onClick={() => router.push('/payments')}>📊 View All Transactions</button>
      </div>
    </div>
  );
}
