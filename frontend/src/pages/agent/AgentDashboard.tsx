import { useState } from 'react'
import { DEMO_ORDERS, DEMO_KNOWLEDGE_DOCS } from '../../services/ai/demoData'
import {
  ShieldAlert,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react'

export default function AgentDashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState('tkt-7281')
  const [resolvedStatus, setResolvedStatus] = useState<string | null>(null)
  const [actionOutput, setActionOutput] = useState<string | null>(null)

  // Demo Escalated Ticket data
  const ticketData = {
    id: 'TKT-7281-REFUND',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      totalOrders: 6,
      customerTier: 'Gold Priority',
    },
    order: DEMO_ORDERS[0],
    intent: 'Refund Delay & Settlement Inquiry',
    sentiment: 'Frustrated',
    urgency: 'Critical',
    department: 'Billing & Financial Operations',
    slaPolicy: DEMO_KNOWLEDGE_DOCS[0].content,
    investigationFindings: [
      'Customer approved for refund on Order #ORD-7281 (₹4,999) 8 days ago.',
      'Exceeds 5–7 business days company SLA by 1 business day.',
      'Payment Gateway trace ID PG-HDFC-994827104 detected with batch settlement hold.',
      'Customer flagged 2nd consecutive time experiencing delayed settlement.',
    ],
    aiSummary:
      'Customer inquiring about delayed ₹4,999 refund for ORD-7281 (Day 8 vs Day 5-7 SLA). AI identified gateway hold, executed safe audit logging, and escalated to Senior Financial Ops.',
    recommendedActions: [
      '1. Trigger Gateway API Re-push for Trace #PG-HDFC-994827104',
      '2. If gateway hold >24h, issue direct instant UPI transfer',
      '3. Credit ₹250 courtesy goodwill coupon for repeat friction',
    ],
  }

  const handleExecuteAction = (actionName: string) => {
    if (actionName === 'repush') {
      setActionOutput('✓ Payment Gateway API Re-push dispatched for Trace ID: PG-HDFC-994827104. Batch state updated to SETTLED.')
    } else if (actionName === 'goodwill') {
      setActionOutput('✓ ₹250 Courtesy Goodwill Coupon (CODE: SUPPORTIQ250) added to customer account.')
    } else if (actionName === 'resolve') {
      setResolvedStatus('Resolved by Financial Ops Specialist with manual gateway release.')
      setActionOutput('✓ Ticket #TKT-7281-REFUND marked as RESOLVED. Customer notified.')
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-in-the-Loop Escalation Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Agent Escalation & Handoff Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review full AI-generated context, investigation findings, and take over critical conversations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            1 Critical Escalation Pending
          </span>
        </div>
      </div>

      {/* Main Workspace: Left Queue + Right Context Package */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Escalation Queue */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Escalation Queue (1)</span>
          </h2>

          <div
            onClick={() => setSelectedTicketId('tkt-7281')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              selectedTicketId === 'tkt-7281'
                ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">#TKT-7281-REFUND</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                CRITICAL
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mt-2">Delayed Refund (8 Days Elapsed)</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Customer Priya Sharma reports refund delay exceeding 5-7 days policy for ORD-7281.
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Customer: Priya Sharma</span>
              <span className="font-semibold text-emerald-400">₹4,999</span>
            </div>
          </div>
        </div>

        {/* Right Column: Full Contextual Human Handoff Package Viewer */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            {/* Header with Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">#TKT-7281-REFUND</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                    Billing & Settlement Hold
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Escalated by AI Orchestrator • Zero Context Loss</p>
              </div>

              {resolvedStatus ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {resolvedStatus}
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  Awaiting Agent Action
                </span>
              )}
            </div>

            {/* Customer & Order Snapshot Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block">Customer</span>
                <span className="font-semibold text-white">{ticketData.customer.name}</span>
                <span className="text-[10px] text-amber-400 block">{ticketData.customer.customerTier}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block">Order & Amount</span>
                <span className="font-mono font-bold text-blue-400">{ticketData.order.order_number}</span>
                <span className="text-[11px] font-bold text-emerald-400 block">₹{ticketData.order.amount.toLocaleString()}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block">Sentiment & Urgency</span>
                <span className="font-semibold text-amber-400 block">{ticketData.sentiment}</span>
                <span className="font-bold text-red-400 block">{ticketData.urgency}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block">Gateway Hold</span>
                <span className="font-mono text-[10px] text-cyan-300 block">PG-HDFC-994827104</span>
                <span className="text-[10px] text-red-400 block">8 Days Elapsed</span>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>AI Autonomous Investigation & Reason for Escalation</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{ticketData.aiSummary}</p>
            </div>

            {/* Investigation Findings List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Investigation Findings</span>
              </h4>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                {ticketData.investigationFindings.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Actions & Agent Resolution Triggers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Recommended Next Actions & Safe Override</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleExecuteAction('repush')}
                  className="p-3.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs text-left transition-all cursor-pointer"
                >
                  <span className="block font-bold text-white mb-1">1. Force Gateway Re-push</span>
                  <span className="text-[11px] text-slate-400">Dispatches PG Trace settlement push</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('goodwill')}
                  className="p-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-semibold text-xs text-left transition-all cursor-pointer"
                >
                  <span className="block font-bold text-white mb-1">2. Add ₹250 Coupon</span>
                  <span className="text-[11px] text-slate-400">Courtesy compensation for delay</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('resolve')}
                  className="p-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs text-left transition-all cursor-pointer"
                >
                  <span className="block font-bold text-white mb-1">3. Mark Resolved</span>
                  <span className="text-[11px] text-slate-400">Close ticket & notify customer</span>
                </button>
              </div>

              {actionOutput && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                  {actionOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
