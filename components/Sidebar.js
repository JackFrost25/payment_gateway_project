'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/', icon: '📊' },
    { section: 'Shopping' },
    { label: 'Store', href: '/store', icon: '🛍️' },
    { section: 'Payment Gateways' },
    { label: 'Stripe', href: '/stripe', icon: '💳' },
    { label: 'Razorpay', href: '/razorpay', icon: '🏦' },
    { section: 'Billing & Pricing' },
    { label: 'Subscriptions', href: '/subscriptions', icon: '🔄' },
    { label: 'Payments', href: '/payments', icon: '💰' },
    { label: 'Invoices', href: '/invoices', icon: '📄' },
    { label: 'Pricing Plans', href: '/pricing', icon: '🏷️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">PG</div>
          <div>
            <div className="sidebar-logo-text">PayGateway</div>
            <div className="sidebar-logo-subtitle">Learning Lab</div>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }

          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="sidebar-env-badge">
          <span className="sidebar-env-dot"></span>
          Test Mode
        </div>
      </div>
    </aside>
  );
}
