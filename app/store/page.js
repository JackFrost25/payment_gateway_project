'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/storeData';
import { useCart } from '@/components/CartContext';
import './store.css';

export default function StorePage() {
  const { addItem, totalItems } = useCart();
  const [quickView, setQuickView] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [toast, setToast] = useState('');

  const handleAddToCart = (product, size, color) => {
    if (!size) { alert('Please select a size'); return; }
    if (!color) { alert('Please select a color'); return; }
    addItem(product, size, color);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
    setQuickView(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const openQuickView = (product) => {
    setQuickView(product);
    setSelectedSize('');
    setSelectedColor('');
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="store-hero animate-in">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>
            <span className="brand-accent">NOIR</span> Collection
          </h1>
          <h1 style={{ fontSize: 36, marginBottom: 16 }}>New Season Arrivals</h1>
          <p>Discover premium fashion essentials crafted for the modern lifestyle. Free shipping on orders over ₹500.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#products" className="btn btn-primary btn-lg">Shop Now →</a>
            {totalItems > 0 && (
              <Link href="/store/cart" className="btn btn-secondary btn-lg">
                🛒 Cart ({totalItems})
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div id="products">
        <div className="flex-between mb-24">
          <h2 className="section-title" style={{ marginBottom: 0 }}>🛍️ All Products</h2>
          <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>{products.length} items</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card animate-in" onClick={() => openQuickView(product)}>
              <div className="product-card-image">
                <Image src={product.image} alt={product.name} width={400} height={300} style={{ objectFit: 'cover' }} />
              </div>
              <div className="product-card-body">
                <div className="product-card-brand">{product.brand}</div>
                <div className="product-card-name">{product.name}</div>
                <div className="product-card-desc">{product.description}</div>
                <div className="product-card-price">₹{product.price.toLocaleString()}</div>
                <div className="product-card-rating">
                  <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
                  <span>{product.rating} ({product.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="cart-floating">
          <Link href="/store/cart" className="cart-floating-btn">
            🛒 View Cart
            <span className="cart-badge-count">{totalItems}</span>
          </Link>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">✓ {toast}</div>}

      {/* Quick View Modal */}
      {quickView && (
        <div className="quick-view-overlay" onClick={() => setQuickView(null)}>
          <div className="quick-view" onClick={(e) => e.stopPropagation()}>
            <div className="quick-view-image">
              <Image src={quickView.image} alt={quickView.name} width={400} height={500} style={{ objectFit: 'cover' }} />
            </div>
            <div className="quick-view-info">
              <button onClick={() => setQuickView(null)} style={{ float: 'right', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 24, cursor: 'pointer' }}>×</button>
              <div className="product-card-brand" style={{ marginBottom: 8 }}>{quickView.brand}</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{quickView.name}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{quickView.description}</p>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>₹{quickView.price.toLocaleString()}</div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Size</label>
                <div className="size-selector">
                  {quickView.sizes.map((s) => (
                    <button key={s} className={`size-btn ${selectedSize === s ? 'selected' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="form-label">Color</label>
                <div className="color-selector">
                  {quickView.colors.map((c) => (
                    <button key={c} className={`color-btn ${selectedColor === c ? 'selected' : ''}`} onClick={() => setSelectedColor(c)}>{c}</button>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => handleAddToCart(quickView, selectedSize, selectedColor)}>
                Add to Cart — ₹{quickView.price.toLocaleString()}
              </button>

              <div className="product-card-rating" style={{ marginTop: 16, justifyContent: 'center' }}>
                <span className="stars">{'★'.repeat(Math.round(quickView.rating))}</span>
                <span>{quickView.rating} ({quickView.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
