'use client';

import { useState } from 'react';
import { mockTransactions, formatCurrency, formatDateTime } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);

  const filtered = mockTransactions.filter((tx) => {
    const matchSearch = !search || tx.id.toLowerCase().includes(search.toLowerCase()) || tx.customer.toLowerCase().includes(search.toLowerCase()) || tx.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchGateway = gatewayFilter === 'all' || tx.gateway === gatewayFilter;
    return matchSearch && matchStatus && matchGateway;
  });

  return (
    <div>
      <div className="page-header">
        <h1>💰 Payment Tracking</h1>
        <p>Monitor all transactions across Stripe and Razorpay</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue animate-in">
          <div className="stat-card-header"><span className="stat-card-label">Total</span><span className="stat-card-icon">📊</span></div>
          <div className="stat-card-value">{mockTransactions.length}</div>
        </div>
        <div className="stat-card green animate-in animate-in-delay-1">
          <div className="stat-card-header"><span className="stat-card-label">Successful</span><span className="stat-card-icon">✅</span></div>
          <div className="stat-card-value">{mockTransactions.filter(t=>t.status==='success').length}</div>
        </div>
        <div className="stat-card purple animate-in animate-in-delay-2">
          <div className="stat-card-header"><span className="stat-card-label">Pending</span><span className="stat-card-icon">⏳</span></div>
          <div className="stat-card-value">{mockTransactions.filter(t=>t.status==='pending').length}</div>
        </div>
        <div className="stat-card cyan animate-in animate-in-delay-3">
          <div className="stat-card-header"><span className="stat-card-label">Failed</span><span className="stat-card-icon">❌</span></div>
          <div className="stat-card-value">{mockTransactions.filter(t=>t.status==='failed').length}</div>
        </div>
      </div>

      <div className="filters-bar">
        <input type="text" className="filter-input" placeholder="🔍 Search by ID, name, or email..." value={search} onChange={e=>setSearch(e.target.value)} style={{minWidth:280}} />
        <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="success">✅ Success</option>
          <option value="pending">⏳ Pending</option>
          <option value="failed">❌ Failed</option>
        </select>
        <select className="filter-select" value={gatewayFilter} onChange={e=>setGatewayFilter(e.target.value)}>
          <option value="all">All Gateways</option>
          <option value="stripe">💳 Stripe</option>
          <option value="razorpay">🏦 Razorpay</option>
        </select>
        <span style={{fontSize:13,color:'var(--text-muted)',marginLeft:'auto'}}>
          {filtered.length} of {mockTransactions.length}
        </span>
      </div>

      <div className="table-container">
        <table className="table">
          <thead><tr><th>Transaction ID</th><th>Customer</th><th>Amount</th><th>Gateway</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {filtered.map(tx=>(
              <tr key={tx.id}>
                <td style={{fontFamily:'monospace',fontSize:13}}>{tx.id}</td>
                <td><div style={{fontWeight:500}}>{tx.customer}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{tx.email}</div></td>
                <td style={{fontWeight:700}}>{formatCurrency(tx.amount)}</td>
                <td><span style={{padding:'3px 8px',borderRadius:4,fontSize:12,fontWeight:600,background:tx.gateway==='stripe'?'rgba(99,91,255,0.1)':'rgba(0,112,243,0.1)',color:tx.gateway==='stripe'?'#818cf8':'#38bdf8'}}>{tx.gateway==='stripe'?'⬡ Stripe':'◈ Razorpay'}</span></td>
                <td><StatusBadge status={tx.status}/></td>
                <td style={{fontSize:13,color:'var(--text-tertiary)'}}>{formatDateTime(tx.date)}</td>
                <td><button className="btn btn-secondary btn-sm" onClick={()=>setSelectedTx(tx)}>Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <div className="modal-overlay" onClick={()=>setSelectedTx(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="modal-close" onClick={()=>setSelectedTx(null)}>×</button>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
              <StatusBadge status={selectedTx.status}/>
              <span style={{fontFamily:'monospace',fontSize:14,color:'var(--text-tertiary)'}}>{selectedTx.id}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}}>
              <div><div style={{fontSize:12,color:'var(--text-muted)',marginBottom:4}}>Customer</div><div style={{fontWeight:600}}>{selectedTx.customer}</div></div>
              <div><div style={{fontSize:12,color:'var(--text-muted)',marginBottom:4}}>Amount</div><div style={{fontSize:24,fontWeight:800}}>{formatCurrency(selectedTx.amount)}</div></div>
              <div><div style={{fontSize:12,color:'var(--text-muted)',marginBottom:4}}>Gateway</div><div>{selectedTx.gateway==='stripe'?'💳 Stripe':'🏦 Razorpay'}</div></div>
              <div><div style={{fontSize:12,color:'var(--text-muted)',marginBottom:4}}>Card</div><div>•••• {selectedTx.cardLast4}</div></div>
            </div>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Payment Timeline</h3>
            <div className="timeline">
              <div className="timeline-item"><div className="timeline-dot info"></div><div className="timeline-content"><h4>Payment Initiated</h4><p>{formatDateTime(selectedTx.date)}</p></div></div>
              <div className="timeline-item"><div className="timeline-dot warning"></div><div className="timeline-content"><h4>Processing</h4><p>Gateway received request</p></div></div>
              <div className="timeline-item"><div className={`timeline-dot ${selectedTx.status==='success'?'success':selectedTx.status==='pending'?'warning':'error'}`}></div><div className="timeline-content"><h4>{selectedTx.status==='success'?'Completed':selectedTx.status==='pending'?'Awaiting':'Declined'}</h4></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
