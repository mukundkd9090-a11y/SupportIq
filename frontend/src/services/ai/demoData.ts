import type { Order, KnowledgeDocument, Ticket } from '../../types'

export const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-7281-uuid',
    customer_id: 'demo-customer-id',
    order_number: 'ORD-7281',
    amount: 4999,
    status: 'refund_delayed',
    items_summary: 'SupportIQ Smart Noise-Cancelling Headphones (Midnight Black)',
    refund_requested_days_ago: 8,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-8419-uuid',
    customer_id: 'demo-customer-id',
    order_number: 'ORD-8419',
    amount: 1899,
    status: 'delivered',
    items_summary: 'Ergonomic Mechanical Keyboard (RGB Backlit, Blue Switches)',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-9042-uuid',
    customer_id: 'demo-customer-id',
    order_number: 'ORD-9042',
    amount: 850,
    status: 'processing',
    items_summary: 'Braided Type-C Fast Charging Cable 2-Pack (2 Meter)',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
]

export const DEMO_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'kb-refund-policy',
    title: 'Standard Refund & Settlement Policy (Section 4.2)',
    category: 'Billing & Refunds',
    description: 'Guidelines on standard refund turnaround times and payment gateway reconciliation.',
    content: `All approved refund requests are processed within 5 to 7 business days back to the original payment source.
If a refund has not settled after 7 business days, it indicates a payment gateway batch reconciliation hold.
Autonomous Resolution Rule: If delay > 7 days, AI system must inspect payment gateway trace ID, flag urgency as HIGH, log action in agent_actions, and escalate to a Level-2 Financial Operations Specialist with full transaction snapshot.`,
    source_url: 'https://supportiq.internal/policies/refund-terms-v4',
  },
  {
    id: 'kb-cancellation-policy',
    title: 'Order Cancellation & Instant Reversal Policy',
    category: 'Orders',
    description: 'Conditions under which an order can be cancelled before dispatch.',
    content: `Orders can be autonomously cancelled within 4 hours of placement if status is 'pending' or 'processing'.
Instant store credit or reversal is triggered immediately with zero cancellation fee.
Once status moves to 'shipped' or 'out for delivery', cancellation is locked and the customer must initiate a standard return post-delivery.`,
    source_url: 'https://supportiq.internal/policies/cancellation',
  },
  {
    id: 'kb-technical-warranty',
    title: 'Hardware Replacement & Warranty Diagnostic Protocol',
    category: 'Technical Support',
    description: 'Troubleshooting steps and warranty coverage for electronic peripherals.',
    content: `All hardware products include a 12-month manufacturer replacement warranty.
Routine connectivity or firmware glitches should first be guided through automated step-by-step diagnostic resets.
If troubleshooting fails and purchase date is within 365 days, generate an instant pre-paid reverse pickup label.`,
    source_url: 'https://supportiq.internal/policies/warranty-diagnostics',
  },
  {
    id: 'kb-account-security',
    title: 'Account Verification & 2FA Recovery Guidelines',
    category: 'Account',
    description: 'Security policies regarding customer password resets, 2FA recovery, and email updates.',
    content: `For account recovery, autonomous reset links can only be dispatched to the verified primary email on file.
Phone number updates require OTP confirmation from the registered email to prevent account takeover attempts.`,
    source_url: 'https://supportiq.internal/policies/security-protocols',
  }
]

export const DEMO_INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-7281-escalated',
    customer_id: 'demo-customer-id',
    order_id: 'ord-7281-uuid',
    subject: 'Delayed Refund (8 Days Elapsed) for Order #ORD-7281',
    status: 'escalated',
    priority: 'urgent',
    department: 'Billing',
    intent: 'Refund Delay Investigation',
    sentiment: 'Frustrated',
    urgency: 'Critical',
    ai_summary: 'Customer requested refund 8 days ago for ₹4,999 (ORD-7281). Policy SLA is 5-7 business days. Second time reporting issue. AI verified delayed gateway batch hold, logged agent_action, and escalated to Human Specialist for instant payment push.',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  }
]
