'use client';

import { useState } from 'react';
import { mockSubscriptions, subscriptionPlans, formatCurrency, formatDate } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h1>🔄 Subscription System</h1>
        <p>Manage subscription plans, view active subscribers, and understand the billing lifecycle</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab==='plans'?'active':''}`} onClick={()=>setActiveTab('plans')}>💎 Plans</button>
        <button className={`tab ${activeTab==='active'?'active':''}`} onClick={()=>setActiveTab('active')}>📋 Active Subscriptions</button>
        <button className={`tab ${activeTab==='lifecycle'?'active':''}`} onClick={()=>setActiveTab('lifecycle')}>🔄 Lifecycle</button>
      </div>

      {activeTab === 'plans' && (
        <div>
          <h2 className="section-title mb-24">Choose Your Plan</h2>
          <div className="pricing-grid">
            {subscriptionPlans.map(plan => (
              <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <div className="pricing-card-name">{plan.name}</div>
                <p style={{fontSize:14,color:'var(--text-tertiary)'}}>{plan.description}</p>
                <div className="pricing-card-price">${plan.price}<span>/mo</span></div>
                <ul className="pricing-card-features">
                  {plan.features.map((f,i)=>(
                    <li key={i}>
                      <span className={f.included?'feature-check':'feature-cross'}>{f.included?'✓':'✕'}</span>
                      {f.name}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${plan.featured?'btn-primary':'btn-secondary'} btn-lg`} style={{width:'100%'}} onClick={()=>setSelectedPlan(plan.name)}>
                  {selectedPlan===plan.name?'✓ Selected':'Subscribe'}
                </button>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div className="card mt-32" style={{textAlign:'center',padding:32}}>
              <div className="payment-status-icon success" style={{margin:'0 auto 16px'}}>✓</div>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Mock Subscription Created!</h3>
              <p style={{color:'var(--text-tertiary)'}}>You selected the <strong>{selectedPlan}</strong> plan. In production, this would call Stripe or Razorpay Subscriptions API.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'active' && (
        <div>
          <div className="stats-grid mb-24">
            <div className="stat-card green"><div className="stat-card-header"><span className="stat-card-label">Active</span><span className="stat-card-icon">✅</span></div><div className="stat-card-value">{mockSubscriptions.filter(s=>s.status==='active').length}</div></div>
            <div className="stat-card blue"><div className="stat-card-header"><span className="stat-card-label">Trial</span><span className="stat-card-icon">🧪</span></div><div className="stat-card-value">{mockSubscriptions.filter(s=>s.status==='trial').length}</div></div>
            <div className="stat-card purple"><div className="stat-card-header"><span className="stat-card-label">MRR</span><span className="stat-card-icon">💰</span></div><div className="stat-card-value">{formatCurrency(mockSubscriptions.filter(s=>s.status==='active').reduce((s,x)=>s+x.amount,0))}</div></div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Customer</th><th>Plan</th><th>Amount</th><th>Gateway</th><th>Status</th><th>Next Billing</th></tr></thead>
              <tbody>
                {mockSubscriptions.map(sub=>(
                  <tr key={sub.id}>
                    <td><div style={{fontWeight:500}}>{sub.customer}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{sub.email}</div></td>
                    <td style={{fontWeight:600}}>{sub.plan}</td>
                    <td style={{fontWeight:700}}>{formatCurrency(sub.amount)}/mo</td>
                    <td><span style={{padding:'3px 8px',borderRadius:4,fontSize:12,fontWeight:600,background:sub.gateway==='stripe'?'rgba(99,91,255,0.1)':'rgba(0,112,243,0.1)',color:sub.gateway==='stripe'?'#818cf8':'#38bdf8'}}>{sub.gateway==='stripe'?'Stripe':'Razorpay'}</span></td>
                    <td><StatusBadge status={sub.status}/></td>
                    <td style={{fontSize:13,color:'var(--text-tertiary)'}}>{sub.nextBilling?formatDate(sub.nextBilling):'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'lifecycle' && (
        <div>
          <div className="explainer-box">
            <h3>🔄 Subscription Lifecycle</h3>
            <p>Understanding how subscriptions transition through different states is essential for building a robust billing system.</p>
          </div>
          <div className="card mb-32">
            <h3 className="section-title">Lifecycle Stages</h3>
            <div className="lifecycle-diagram">
              <div className="lifecycle-stage"><div className="lifecycle-box trial">Trial</div><div className="lifecycle-desc">Free trial period</div></div>
              <div className="lifecycle-arrow">→</div>
              <div className="lifecycle-stage"><div className="lifecycle-box active">Active</div><div className="lifecycle-desc">Paying customer</div></div>
              <div className="lifecycle-arrow">→</div>
              <div className="lifecycle-stage"><div className="lifecycle-box renewal">Renewal</div><div className="lifecycle-desc">Auto-charge</div></div>
              <div className="lifecycle-arrow">→</div>
              <div className="lifecycle-stage"><div className="lifecycle-box cancelled">Cancelled</div><div className="lifecycle-desc">Ended by user</div></div>
            </div>
          </div>
          <div className="grid-2">
            <div className="card">
              <h3 className="section-title">📖 Stripe Subscriptions</h3>
              <ol className="explainer-steps">
                <li>Create a <strong>Customer</strong> object</li>
                <li>Attach a <strong>PaymentMethod</strong></li>
                <li>Create a <strong>Subscription</strong> with price ID</li>
                <li>Handle <strong>invoice.payment_succeeded</strong> webhook</li>
              </ol>
            </div>
            <div className="card">
              <h3 className="section-title">📖 Razorpay Subscriptions</h3>
              <ol className="explainer-steps">
                <li>Create a <strong>Plan</strong> with billing interval</li>
                <li>Create a <strong>Subscription</strong> for plan</li>
                <li>Redirect to <strong>Checkout</strong> page</li>
                <li>Handle <strong>subscription.charged</strong> webhook</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
