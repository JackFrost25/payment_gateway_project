'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import '../store.css';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, tax, shipping, total, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <div className="page-header"><h1>🛒 Your Cart</h1></div>
        <div className="empty-state" style={{ padding: '100px 32px' }}>
          <div className="empty-state-icon">🛍️</div>
          <h3>Your cart is empty</h3>
          <p style={{ marginBottom: 24 }}>Browse our collection and add items to get started</p>
          <Link href="/store" className="btn btn-primary btn-lg">Continue Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>🛒 Your Cart</h1>
        <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
        {/* Cart Items */}
        <div>
          {items.map((item, idx) => (
            <div key={idx} className="cart-item animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="cart-item-image">
                <Image src={item.product.image} alt={item.product.name} width={100} height={100} style={{ objectFit: 'cover' }} />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-meta">Size: {item.size} · Color: {item.color}</div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}>−</button>
                    <div className="qty-value">{item.quantity}</div>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}>+</button>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => removeItem(item.product.id, item.size, item.color)} style={{ color: 'var(--error)' }}>Remove</button>
                </div>
              </div>
              <div className="cart-item-price">₹{(item.product.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
          <Link href="/store" className="btn btn-secondary mt-16">← Continue Shopping</Link>
        </div>

        {/* Order Summary */}
        <div className="order-summary animate-in animate-in-delay-2">
          <h3>🧾 Order Summary</h3>
          <div className="order-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          <div className="order-summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          <div className="order-summary-row"><span>Shipping</span><span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <div className="order-summary-row total"><span>Total</span><span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          {shipping === 0 && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--success-bg)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
              🎉 You qualify for free shipping!
            </div>
          )}
          <Link href="/store/checkout" className="btn btn-primary btn-lg mt-24" style={{ width: '100%', textDecoration: 'none' }}>
            Proceed to Checkout →
          </Link>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
            🔒 Secure checkout powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
