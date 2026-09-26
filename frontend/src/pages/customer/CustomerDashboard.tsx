import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { DEMO_ORDERS } from '../../services/ai/demoData'
import {
  Sparkles,
  MessageSquareCode,
  Package,
  Ticket as TicketIcon,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export default function CustomerDashboard() {
  const { profile, user } = useAuth()
  const navigate = useNavigate()

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Friend'

  const launchDemoScenario = () => {
    navigate('/customer/support', {
      state: {
        prefillPrompt:
          "I requested a refund 8 days ago. It still hasn't arrived. This is the second time I'm facing this issue.",
        autoSend: true,
      },
    })
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-indigo-950/50 border border-blue-500/20 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-semibold text-blue-300">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Autonomous Resolution Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{userName}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              SupportIQ helps resolve your order and support requests quickly and safely — investigating your account context, checking company policies, and connecting you with human specialists whenever needed.
            </p>
          </div>

          {/* Quick Support Action Triggers */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={launchDemoScenario}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Run Hackathon Demo Flow</span>
            </button>
            <Link
              to="/customer/support"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm transition-all"
            >
              <MessageSquareCode className="w-4 h-4 text-slate-400" />
              <span>Open Support Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Orders</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">{DEMO_ORDERS.length}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">1 Delivered</span> • 1 Refund Delayed
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Support Tickets</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TicketIcon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">1 Active</p>
          <p className="text-xs text-amber-400 mt-1 flex items-center gap-1 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> High Priority Escalation
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Resolution Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">94.2%</p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">Fast & safe issue resolution</p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Investigation</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">&lt; 1.8s</p>
          <p className="text-xs text-purple-400 mt-1 font-medium">Instant context lookup</p>
        </div>
      </div>

      {/* Main Content Sections: Orders & How SupportIQ Resolves Your Issue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              <span>Recent Orders & Status</span>
            </h2>
            <Link to="/customer/orders" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_ORDERS.map((order) => {
              const isDelayed = order.status === 'refund_delayed'
              return (
                <div
                  key={order.id}
                  className={`p-5 rounded-2xl bg-slate-900/70 border transition-all ${
                    isDelayed
                      ? 'border-amber-500/40 bg-amber-500/5 shadow-md shadow-amber-500/5'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-white">{order.order_number}</span>
                        {isDelayed ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Refund delayed — 8 days
                          </span>
                        ) : order.status === 'delivered' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Delivered
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            Processing
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{order.items_summary}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-right">
                        <span className="text-xs text-slate-500">Amount</span>
                        <p className="text-sm font-bold text-slate-200">₹{order.amount.toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() =>
                          navigate('/customer/support', {
                            state: {
                              prefillPrompt: `I need an update on my order ${order.order_number}.`,
                              autoSend: true,
                            },
                          })
                        }
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                      >
                        Ask AI Support
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* How SupportIQ Resolves Your Issue Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">How SupportIQ Resolves Your Issue</h3>
              <p className="text-xs text-slate-400">From understanding your problem to resolution — with human help when needed.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                stage: 'Understand',
                desc: 'AI understands your problem, intent, and urgency.',
                color: 'text-blue-400',
              },
              {
                stage: 'Investigate',
                desc: 'Checks your orders, tickets, and account history.',
                color: 'text-cyan-400',
              },
              {
                stage: 'Check Policy',
                desc: 'Checks the relevant company policies and rules.',
                color: 'text-indigo-400',
              },
              {
                stage: 'Take Action',
                desc: 'Performs safe actions when possible.',
                color: 'text-purple-400',
              },
              {
                stage: 'Resolve or Escalate',
                desc: 'Solves the issue or sends the complete context to a human agent.',
                color: 'text-emerald-400',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className={`text-xs font-bold font-mono ${step.color}`}>{idx + 1}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{step.stage}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
            <span className="font-semibold text-white">Need help with an order?</span> Open Support Chat anytime to get instant AI assistance or fast human support.
          </div>
        </div>
      </div>
    </div>
  )
}
