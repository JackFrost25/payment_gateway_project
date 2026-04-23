export default function StatusBadge({ status }) {
  const labels = {
    success: 'Success',
    paid: 'Paid',
    active: 'Active',
    pending: 'Pending',
    trial: 'Trial',
    unpaid: 'Unpaid',
    past_due: 'Past Due',
    failed: 'Failed',
    cancelled: 'Cancelled',
    overdue: 'Overdue',
  };

  const colors = {
    success: 'success',
    paid: 'success',
    active: 'success',
    pending: 'warning',
    trial: 'info',
    unpaid: 'warning',
    past_due: 'warning',
    failed: 'error',
    cancelled: 'error',
    overdue: 'error',
  };

  const colorClass = colors[status] || 'info';
  const label = labels[status] || status;

  return (
    <span className={`badge ${colorClass}`}>
      <span className="badge-dot"></span>
      {label}
    </span>
  );
}
