// Mock data for the payment gateway learning project

export function generateTransactionId() {
  return 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function generateInvoiceNumber(index) {
  return `INV-2026-${String(index).padStart(4, '0')}`;
}

export const mockTransactions = [
  {
    id: 'TXN_A1B2C3D4',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    amount: 299.99,
    currency: 'USD',
    status: 'success',
    gateway: 'stripe',
    date: '2026-04-22T10:30:00Z',
    description: 'Pro Plan Subscription',
    cardLast4: '4242',
  },
  {
    id: 'TXN_E5F6G7H8',
    customer: 'Bob Williams',
    email: 'bob@example.com',
    amount: 149.00,
    currency: 'USD',
    status: 'success',
    gateway: 'razorpay',
    date: '2026-04-22T09:15:00Z',
    description: 'One-time Purchase',
    cardLast4: '1234',
  },
  {
    id: 'TXN_I9J0K1L2',
    customer: 'Carol Davis',
    email: 'carol@example.com',
    amount: 99.00,
    currency: 'USD',
    status: 'pending',
    gateway: 'stripe',
    date: '2026-04-22T08:45:00Z',
    description: 'Enterprise Add-on',
    cardLast4: '5678',
  },
  {
    id: 'TXN_M3N4O5P6',
    customer: 'David Lee',
    email: 'david@example.com',
    amount: 499.99,
    currency: 'USD',
    status: 'failed',
    gateway: 'razorpay',
    date: '2026-04-21T16:20:00Z',
    description: 'Enterprise Plan Subscription',
    cardLast4: '9012',
  },
  {
    id: 'TXN_Q7R8S9T0',
    customer: 'Eva Martinez',
    email: 'eva@example.com',
    amount: 29.99,
    currency: 'USD',
    status: 'success',
    gateway: 'stripe',
    date: '2026-04-21T14:10:00Z',
    description: 'Basic Plan Subscription',
    cardLast4: '3456',
  },
  {
    id: 'TXN_U1V2W3X4',
    customer: 'Frank Chen',
    email: 'frank@example.com',
    amount: 199.00,
    currency: 'USD',
    status: 'success',
    gateway: 'stripe',
    date: '2026-04-21T11:30:00Z',
    description: 'Pro Plan Renewal',
    cardLast4: '7890',
  },
  {
    id: 'TXN_Y5Z6A7B8',
    customer: 'Grace Kim',
    email: 'grace@example.com',
    amount: 75.50,
    currency: 'USD',
    status: 'success',
    gateway: 'razorpay',
    date: '2026-04-20T20:00:00Z',
    description: 'Product Purchase',
    cardLast4: '2468',
  },
  {
    id: 'TXN_C9D0E1F2',
    customer: 'Henry Patel',
    email: 'henry@example.com',
    amount: 599.00,
    currency: 'USD',
    status: 'pending',
    gateway: 'stripe',
    date: '2026-04-20T15:45:00Z',
    description: 'Enterprise Plan Upgrade',
    cardLast4: '1357',
  },
  {
    id: 'TXN_G3H4I5J6',
    customer: 'Iris Wang',
    email: 'iris@example.com',
    amount: 45.00,
    currency: 'USD',
    status: 'success',
    gateway: 'razorpay',
    date: '2026-04-20T10:20:00Z',
    description: 'Add-on Purchase',
    cardLast4: '9753',
  },
  {
    id: 'TXN_K7L8M9N0',
    customer: 'Jake Thompson',
    email: 'jake@example.com',
    amount: 29.99,
    currency: 'USD',
    status: 'failed',
    gateway: 'stripe',
    date: '2026-04-19T22:10:00Z',
    description: 'Basic Plan Subscription',
    cardLast4: '8642',
  },
];

export const mockSubscriptions = [
  {
    id: 'SUB_001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    plan: 'Pro',
    amount: 29.00,
    currency: 'USD',
    status: 'active',
    gateway: 'stripe',
    startDate: '2026-01-15T00:00:00Z',
    nextBilling: '2026-05-15T00:00:00Z',
    interval: 'monthly',
  },
  {
    id: 'SUB_002',
    customer: 'Bob Williams',
    email: 'bob@example.com',
    plan: 'Enterprise',
    amount: 99.00,
    currency: 'USD',
    status: 'active',
    gateway: 'razorpay',
    startDate: '2025-11-01T00:00:00Z',
    nextBilling: '2026-05-01T00:00:00Z',
    interval: 'monthly',
  },
  {
    id: 'SUB_003',
    customer: 'Carol Davis',
    email: 'carol@example.com',
    plan: 'Pro',
    amount: 29.00,
    currency: 'USD',
    status: 'trial',
    gateway: 'stripe',
    startDate: '2026-04-10T00:00:00Z',
    nextBilling: '2026-05-10T00:00:00Z',
    interval: 'monthly',
  },
  {
    id: 'SUB_004',
    customer: 'David Lee',
    email: 'david@example.com',
    plan: 'Basic',
    amount: 9.00,
    currency: 'USD',
    status: 'cancelled',
    gateway: 'stripe',
    startDate: '2025-06-01T00:00:00Z',
    nextBilling: null,
    interval: 'monthly',
  },
  {
    id: 'SUB_005',
    customer: 'Eva Martinez',
    email: 'eva@example.com',
    plan: 'Enterprise',
    amount: 99.00,
    currency: 'USD',
    status: 'past_due',
    gateway: 'razorpay',
    startDate: '2025-09-15T00:00:00Z',
    nextBilling: '2026-04-15T00:00:00Z',
    interval: 'monthly',
  },
];

export const mockInvoices = [
  {
    id: 'INV-2026-0001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    amount: 299.99,
    tax: 24.00,
    total: 323.99,
    status: 'paid',
    issueDate: '2026-04-01T00:00:00Z',
    dueDate: '2026-04-30T00:00:00Z',
    items: [
      { description: 'Pro Plan - Monthly', quantity: 1, unitPrice: 29.00, total: 29.00 },
      { description: 'API Access Add-on', quantity: 1, unitPrice: 19.99, total: 19.99 },
      { description: 'Premium Support', quantity: 1, unitPrice: 251.00, total: 251.00 },
    ],
  },
  {
    id: 'INV-2026-0002',
    customer: 'Bob Williams',
    email: 'bob@example.com',
    amount: 99.00,
    tax: 7.92,
    total: 106.92,
    status: 'paid',
    issueDate: '2026-04-01T00:00:00Z',
    dueDate: '2026-04-30T00:00:00Z',
    items: [
      { description: 'Enterprise Plan - Monthly', quantity: 1, unitPrice: 99.00, total: 99.00 },
    ],
  },
  {
    id: 'INV-2026-0003',
    customer: 'Carol Davis',
    email: 'carol@example.com',
    amount: 58.00,
    tax: 4.64,
    total: 62.64,
    status: 'unpaid',
    issueDate: '2026-04-15T00:00:00Z',
    dueDate: '2026-05-15T00:00:00Z',
    items: [
      { description: 'Pro Plan - Monthly', quantity: 2, unitPrice: 29.00, total: 58.00 },
    ],
  },
  {
    id: 'INV-2026-0004',
    customer: 'David Lee',
    email: 'david@example.com',
    amount: 499.99,
    tax: 40.00,
    total: 539.99,
    status: 'overdue',
    issueDate: '2026-03-01T00:00:00Z',
    dueDate: '2026-03-31T00:00:00Z',
    items: [
      { description: 'Enterprise Plan - Annual', quantity: 1, unitPrice: 499.99, total: 499.99 },
    ],
  },
];

export const subscriptionPlans = [
  {
    name: 'Basic',
    price: 9,
    interval: 'month',
    description: 'Perfect for individuals getting started',
    features: [
      { name: '1,000 transactions/month', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Single payment gateway', included: true },
      { name: 'API access', included: false },
      { name: 'Custom invoices', included: false },
      { name: 'Priority support', included: false },
      { name: 'White-label', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 29,
    interval: 'month',
    description: 'Best for growing businesses',
    featured: true,
    features: [
      { name: '10,000 transactions/month', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Multiple gateways', included: true },
      { name: 'Full API access', included: true },
      { name: 'Custom invoices', included: true },
      { name: 'Priority support', included: false },
      { name: 'White-label', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    description: 'For large-scale operations',
    features: [
      { name: 'Unlimited transactions', included: true },
      { name: 'Real-time analytics', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'All gateways', included: true },
      { name: 'Full API access', included: true },
      { name: 'Custom invoices', included: true },
      { name: 'Priority support', included: true },
      { name: 'White-label', included: true },
    ],
  },
];

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status) {
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
  return colors[status] || 'info';
}
