'use client';

import { useState } from 'react';
import { subscriptionPlans } from '@/lib/mockData';

export default function PricingPage() {
  // Initialize plans with an active property
  const [plans, setPlans] = useState(() => 
    subscriptionPlans.map(plan => ({ ...plan, active: plan.active !== false }))
  );
  const [activeTab, setActiveTab] = useState('list');
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 0,
    interval: 'month',
    description: '',
    featured: false,
    active: true,
    features: [
      { name: '', included: true }
    ]
  });

  const addFeature = () => {
    setNewPlan({ ...newPlan, features: [...newPlan.features, { name: '', included: true }] });
  };

  const updateFeature = (index, field, value) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setNewPlan({ ...newPlan, features: updatedFeatures });
  };

  const removeFeature = (index) => {
    const updatedFeatures = newPlan.features.filter((_, i) => i !== index);
    setNewPlan({ ...newPlan, features: updatedFeatures });
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    setPlans([...plans, newPlan]);
    setActiveTab('list');
    // Reset form
    setNewPlan({
      name: '',
      price: 0,
      interval: 'month',
      description: '',
      featured: false,
      active: true,
      features: [{ name: '', included: true }]
    });
  };

  const togglePlanStatus = (index) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { ...updatedPlans[index], active: !updatedPlans[index].active };
    setPlans(updatedPlans);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏷️ Pricing Management</h1>
        <p>Configure pricing plans, manage features, and set up billing cycles</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>📋 Active Plans</button>
        <button className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>➕ Create New Plan</button>
      </div>

      {activeTab === 'list' && (
        <div>
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.featured ? 'featured' : ''}`} style={{ opacity: plan.active ? 1 : 0.6, filter: plan.active ? 'none' : 'grayscale(1)' }}>
                <div className="flex-between mb-16">
                  <div className="pricing-card-name" style={{ margin: 0 }}>
                    {plan.name}
                    {!plan.active && <span style={{ fontSize: 12, color: 'var(--error)', marginLeft: 8, fontWeight: 'normal' }}>(Inactive)</span>}
                  </div>
                  {plan.featured && plan.active && <span className="badge" style={{ background: 'var(--primary)', color: 'white' }}>Featured</span>}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>{plan.description}</p>
                <div className="pricing-card-price">${plan.price}<span>/{plan.interval}</span></div>
                <ul className="pricing-card-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>
                      <span className={f.included ? 'feature-check' : 'feature-cross'}>{f.included ? '✓' : '✕'}</span>
                      {f.name}
                    </li>
                  ))}
                </ul>
                <div className="flex-between mt-24">
                  <button 
                    className={`btn ${plan.active ? 'btn-secondary' : 'btn-primary'}`} 
                    style={{ flex: 1, marginRight: 8 }}
                    onClick={() => togglePlanStatus(index)}
                  >
                    {plan.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1, marginLeft: 8 }} onClick={() => setPlans(plans.filter((_, i) => i !== index))}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h3 className="section-title">Configure New Plan</h3>
          <form onSubmit={handleCreatePlan}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Plan Name</label>
                <input className="form-input" required value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} placeholder="e.g. Pro, Enterprise" />
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input className="form-input" type="number" required value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })} min="0" step="0.01" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Billing Interval</label>
                <select className="form-select" value={newPlan.interval} onChange={(e) => setNewPlan({ ...newPlan, interval: e.target.value })}>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                  <option value="week">Weekly</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newPlan.featured} onChange={(e) => setNewPlan({ ...newPlan, featured: e.target.checked })} style={{ marginRight: 8, width: 20, height: 20 }} />
                  <span style={{ fontWeight: 500 }}>Highlight as Featured Plan</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" required value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })} placeholder="Short description for the pricing table" />
            </div>

            <h3 className="section-title mt-32">Features List</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14, marginBottom: 16 }}>Add the features that will be displayed on the pricing table.</p>
            
            {newPlan.features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <input className="form-input" required value={feature.name} onChange={(e) => updateFeature(index, 'name', e.target.value)} placeholder="e.g. Unlimited API Calls" />
                </div>
                <div style={{ width: 120 }}>
                  <select className="form-select" value={feature.included.toString()} onChange={(e) => updateFeature(index, 'included', e.target.value === 'true')}>
                    <option value="true">Included (✓)</option>
                    <option value="false">Excluded (✕)</option>
                  </select>
                </div>
                {newPlan.features.length > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={() => removeFeature(index)}>✕</button>
                )}
              </div>
            ))}
            
            <button type="button" className="btn btn-secondary btn-sm mt-12" onClick={addFeature}>+ Add Another Feature</button>

            <div className="mt-32 pt-24" style={{ borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Pricing Plan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
