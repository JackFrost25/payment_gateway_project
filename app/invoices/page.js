'use client';

import { useState } from 'react';
import { mockInvoices, formatCurrency, formatDate } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import InvoicePreview from '@/components/InvoicePreview';

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newInvoice, setNewInvoice] = useState({
    customer: '', email: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now()+30*24*60*60*1000).toISOString().split('T')[0],
    issueTime: '09:00', timezone: 'UTC',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 8,
  });
  const [previewInvoice, setPreviewInvoice] = useState(null);

  const addItem = () => setNewInvoice({...newInvoice, items:[...newInvoice.items, {description:'',quantity:1,unitPrice:0}]});

  const updateItem = (idx, field, value) => {
    const items = [...newInvoice.items];
    items[idx] = {...items[idx], [field]: field==='quantity'||field==='unitPrice'?Number(value):value};
    setNewInvoice({...newInvoice, items});
  };

  const removeItem = (idx) => {
    if(newInvoice.items.length<=1) return;
    setNewInvoice({...newInvoice, items:newInvoice.items.filter((_,i)=>i!==idx)});
  };

  const generatePreview = () => {
    const items = newInvoice.items.map(it=>({...it, total: it.quantity*it.unitPrice}));
    const subtotal = items.reduce((s,it)=>s+it.total,0);
    const tax = subtotal*(newInvoice.taxRate/100);
    setPreviewInvoice({
      id: `INV-2026-${String(mockInvoices.length+1).padStart(4,'0')}`,
      customer: newInvoice.customer || 'Customer Name',
      email: newInvoice.email || 'customer@example.com',
      issueDate: `${newInvoice.issueDate}T${newInvoice.issueTime}:00Z`,
      dueDate: `${newInvoice.dueDate}T23:59:59Z`,
      items, amount: subtotal, tax, total: subtotal+tax, status: 'unpaid',
    });
    setActiveTab('preview');
  };

  return (
    <div>
      <div className="page-header">
        <h1>📄 Invoice Generation</h1>
        <p>Create, manage, and track invoices with date and time configuration</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab==='list'?'active':''}`} onClick={()=>setActiveTab('list')}>📋 All Invoices</button>
        <button className={`tab ${activeTab==='create'?'active':''}`} onClick={()=>setActiveTab('create')}>✍️ Create Invoice</button>
        {previewInvoice && <button className={`tab ${activeTab==='preview'?'active':''}`} onClick={()=>setActiveTab('preview')}>👁️ Preview</button>}
      </div>

      {activeTab === 'list' && (
        <div>
          <div className="stats-grid mb-24">
            <div className="stat-card green"><div className="stat-card-header"><span className="stat-card-label">Paid</span><span className="stat-card-icon">✅</span></div><div className="stat-card-value">{mockInvoices.filter(i=>i.status==='paid').length}</div></div>
            <div className="stat-card purple"><div className="stat-card-header"><span className="stat-card-label">Unpaid</span><span className="stat-card-icon">📨</span></div><div className="stat-card-value">{mockInvoices.filter(i=>i.status==='unpaid').length}</div></div>
            <div className="stat-card cyan"><div className="stat-card-header"><span className="stat-card-label">Overdue</span><span className="stat-card-icon">⚠️</span></div><div className="stat-card-value">{mockInvoices.filter(i=>i.status==='overdue').length}</div></div>
            <div className="stat-card blue"><div className="stat-card-header"><span className="stat-card-label">Total Value</span><span className="stat-card-icon">💰</span></div><div className="stat-card-value">{formatCurrency(mockInvoices.reduce((s,i)=>s+i.total,0))}</div></div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Invoice #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Issue Date</th><th>Due Date</th><th></th></tr></thead>
              <tbody>
                {mockInvoices.map(inv=>(
                  <tr key={inv.id}>
                    <td style={{fontFamily:'monospace',fontWeight:600}}>{inv.id}</td>
                    <td><div style={{fontWeight:500}}>{inv.customer}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{inv.email}</div></td>
                    <td style={{fontWeight:700}}>{formatCurrency(inv.total)}</td>
                    <td><StatusBadge status={inv.status}/></td>
                    <td style={{fontSize:13,color:'var(--text-tertiary)'}}>{formatDate(inv.issueDate)}</td>
                    <td style={{fontSize:13,color:'var(--text-tertiary)'}}>{formatDate(inv.dueDate)}</td>
                    <td><button className="btn btn-secondary btn-sm" onClick={()=>{setSelectedInvoice(inv);setActiveTab('preview');setPreviewInvoice(inv);}}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="grid-2">
          <div className="card">
            <h3 className="section-title">📝 Invoice Details</h3>
            <div className="form-group"><label className="form-label">Customer Name</label><input className="form-input" value={newInvoice.customer} onChange={e=>setNewInvoice({...newInvoice,customer:e.target.value})} placeholder="John Doe"/></div>
            <div className="form-group"><label className="form-label">Customer Email</label><input className="form-input" type="email" value={newInvoice.email} onChange={e=>setNewInvoice({...newInvoice,email:e.target.value})} placeholder="john@example.com"/></div>

            <h3 className="section-title mt-24">📅 Date & Time Configuration</h3>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Issue Date</label><input className="form-input" type="date" value={newInvoice.issueDate} onChange={e=>setNewInvoice({...newInvoice,issueDate:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={newInvoice.dueDate} onChange={e=>setNewInvoice({...newInvoice,dueDate:e.target.value})}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Issue Time</label><input className="form-input" type="time" value={newInvoice.issueTime} onChange={e=>setNewInvoice({...newInvoice,issueTime:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Timezone</label>
                <select className="form-select" value={newInvoice.timezone} onChange={e=>setNewInvoice({...newInvoice,timezone:e.target.value})}>
                  <option value="UTC">UTC</option>
                  <option value="IST">IST (UTC+5:30)</option>
                  <option value="EST">EST (UTC-5)</option>
                  <option value="PST">PST (UTC-8)</option>
                  <option value="CET">CET (UTC+1)</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Tax Rate (%)</label><input className="form-input" type="number" value={newInvoice.taxRate} onChange={e=>setNewInvoice({...newInvoice,taxRate:Number(e.target.value)})}/></div>
          </div>

          <div className="card">
            <div className="flex-between mb-16"><h3 className="section-title" style={{marginBottom:0}}>📦 Line Items</h3><button className="btn btn-secondary btn-sm" onClick={addItem}>+ Add Item</button></div>
            {newInvoice.items.map((item,i)=>(
              <div key={i} style={{padding:16,background:'var(--bg-glass)',borderRadius:'var(--radius-md)',marginBottom:12}}>
                <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={item.description} onChange={e=>updateItem(i,'description',e.target.value)} placeholder="Product or service"/></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Qty</label><input className="form-input" type="number" min="1" value={item.quantity} onChange={e=>updateItem(i,'quantity',e.target.value)}/></div>
                  <div className="form-group"><label className="form-label">Unit Price ($)</label><input className="form-input" type="number" min="0" step="0.01" value={item.unitPrice} onChange={e=>updateItem(i,'unitPrice',e.target.value)}/></div>
                </div>
                <div className="flex-between" style={{marginTop:8}}>
                  <span style={{fontSize:13,color:'var(--text-muted)'}}>Total: {formatCurrency(item.quantity*item.unitPrice)}</span>
                  {newInvoice.items.length>1&&<button className="btn btn-secondary btn-sm" style={{fontSize:12}} onClick={()=>removeItem(i)}>Remove</button>}
                </div>
              </div>
            ))}
            <div style={{marginTop:16,padding:16,background:'rgba(99,102,241,0.05)',borderRadius:'var(--radius-md)',border:'1px solid var(--border-accent)'}}>
              <div className="flex-between" style={{marginBottom:8}}><span style={{color:'var(--text-secondary)'}}>Subtotal</span><span style={{fontWeight:600}}>{formatCurrency(newInvoice.items.reduce((s,it)=>s+it.quantity*it.unitPrice,0))}</span></div>
              <div className="flex-between" style={{marginBottom:8}}><span style={{color:'var(--text-secondary)'}}>Tax ({newInvoice.taxRate}%)</span><span style={{fontWeight:600}}>{formatCurrency(newInvoice.items.reduce((s,it)=>s+it.quantity*it.unitPrice,0)*(newInvoice.taxRate/100))}</span></div>
              <div className="flex-between" style={{paddingTop:8,borderTop:'1px solid var(--border-primary)'}}><span style={{fontWeight:700,fontSize:16}}>Total</span><span style={{fontWeight:800,fontSize:20}}>{formatCurrency(newInvoice.items.reduce((s,it)=>s+it.quantity*it.unitPrice,0)*(1+newInvoice.taxRate/100))}</span></div>
            </div>
            <button className="btn btn-primary btn-lg mt-24" style={{width:'100%'}} onClick={generatePreview}>Generate Invoice Preview</button>
          </div>
        </div>
      )}

      {activeTab === 'preview' && previewInvoice && (
        <div>
          <div className="flex-between mb-24">
            <button className="btn btn-secondary" onClick={()=>setActiveTab('list')}>← Back to List</button>
            <button className="btn btn-primary" onClick={()=>window.print()}>🖨️ Print / Save PDF</button>
          </div>
          <InvoicePreview invoice={previewInvoice}/>
        </div>
      )}
    </div>
  );
}
