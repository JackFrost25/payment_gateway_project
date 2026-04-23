import Link from 'next/link';
import { mockTransactions, formatCurrency, formatDateTime } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';

export default function DashboardPage() {
  const totalRevenue = mockTransactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to PayGateway Learning Lab — your sandbox for understanding payment systems.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue animate-in">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Revenue</span>
            <span className="stat-card-icon">💰</span>
          </div>
          <div className="stat-card-value">{formatCurrency(totalRevenue)}</div>
          <div className="stat-card-change positive">↑ 12.5% from last month</div>
        </div>

        <div className="stat-card green animate-in animate-in-delay-1">
          <div className="stat-card-header">
            <span className="stat-card-label">Active Subscriptions</span>
            <span className="stat-card-icon">🔄</span>
          </div>
          <div className="stat-card-value">24</div>
          <div className="stat-card-change positive">↑ 3 new this week</div>
        </div>

        <div className="stat-card purple animate-in animate-in-delay-2">
          <div className="stat-card-header">
            <span className="stat-card-label">Pending Payments</span>
            <span className="stat-card-icon">⏳</span>
          </div>
          <div className="stat-card-value">5</div>
          <div className="stat-card-change negative">↑ 2 need attention</div>
        </div>

        <div className="stat-card cyan animate-in animate-in-delay-3">
          <div className="stat-card-header">
            <span className="stat-card-label">Invoices Generated</span>
            <span className="stat-card-icon">📄</span>
          </div>
          <div className="stat-card-value">128</div>
          <div className="stat-card-change positive">↑ 8.3% from last month</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">🚀 Quick Actions</h2>
        <div className="gateway-cards" style={{ marginBottom: 32 }}>
          <Link href="/stripe" style={{ textDecoration: 'none' }}>
            <div className="gateway-card stripe">
              <h3 style={{ color: '#818cf8' }}>💳 Stripe Payments</h3>
              <p>Learn how Stripe processes payments with Payment Intents, client secrets, and card tokenization.</p>
              <span className="btn btn-stripe btn-sm">Explore Stripe →</span>
            </div>
          </Link>
          <Link href="/razorpay" style={{ textDecoration: 'none' }}>
            <div className="gateway-card razorpay">
              <h3 style={{ color: '#38bdf8' }}>🏦 Razorpay Payments</h3>
              <p>Understand Razorpay&apos;s order creation, checkout integration, and signature verification.</p>
              <span className="btn btn-razorpay btn-sm">Explore Razorpay →</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="section">
        <h2 className="section-title">📈 Revenue Overview</h2>
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 200, paddingTop: 20 }}>
            {[65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100, 88].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: '100%',
                    height: `${h}%`,
                    background: i === 11
                      ? 'var(--gradient-primary)'
                      : 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    minHeight: 4,
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="section">
        <div className="flex-between mb-16">
          <h2 className="section-title" style={{ marginBottom: 0 }}>💳 Recent Transactions</h2>
          <Link href="/payments" className="btn btn-secondary btn-sm">View All →</Link>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{tx.id}</td>
                  <td>
                    <div>{tx.customer}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(tx.amount)}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: tx.gateway === 'stripe'
                        ? 'rgba(99, 91, 255, 0.1)'
                        : 'rgba(0, 112, 243, 0.1)',
                      color: tx.gateway === 'stripe' ? '#818cf8' : '#38bdf8',
                    }}>
                      {tx.gateway === 'stripe' ? '⬡ Stripe' : '◈ Razorpay'}
                    </span>
                  </td>
                  <td><StatusBadge status={tx.status} /></td>
                  <td style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{formatDateTime(tx.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
