export default function InvoicePreview({ invoice }) {
  if (!invoice) return null;

  const subtotal = invoice.items?.reduce((sum, item) => sum + item.total, 0) || 0;
  const tax = invoice.tax || subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="invoice-preview">
      <div className="invoice-header">
        <div>
          <div className="invoice-company">PayGateway</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            123 Business Street<br />
            San Francisco, CA 94105<br />
            support@paygateway.io
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="invoice-title">INVOICE</div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
            {invoice.id}
          </div>
        </div>
      </div>

      <div className="invoice-meta">
        <div>
          <div className="invoice-meta-label">Bill To</div>
          <div className="invoice-meta-value">
            {invoice.customer}<br />
            {invoice.email}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: 12 }}>
            <div className="invoice-meta-label">Invoice Date</div>
            <div className="invoice-meta-value">
              {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
          </div>
          <div>
            <div className="invoice-meta-label">Due Date</div>
            <div className="invoice-meta-value">
              {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ textAlign: 'center' }}>Qty</th>
            <th style={{ textAlign: 'right' }}>Unit Price</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, idx) => (
            <tr key={idx}>
              <td>{item.description}</td>
              <td style={{ textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</td>
              <td style={{ textAlign: 'right' }}>${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-totals">
        <div className="invoice-totals-table">
          <div className="invoice-totals-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="invoice-totals-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="invoice-totals-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: 40, 
        paddingTop: 20, 
        borderTop: '1px solid #e2e8f0',
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        Thank you for your business! Payment is due within 30 days.
      </div>
    </div>
  );
}
