import { useNavigate } from 'react-router-dom'
import { DEMO_ORDERS } from '../../services/ai/demoData'
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  MessageSquareCode,
  ShieldCheck,
} from 'lucide-react'

export default function MyOrders() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-blue-400" />
            <span>My Orders</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your orders and get help with any issue.
          </p>
        </div>

        <button
          onClick={() =>
            navigate('/customer/support', {
              state: {
                prefillPrompt:
                  "I requested a refund 8 days ago. It still hasn't arrived. This is the second time I'm facing this issue.",
                autoSend: true,
              },
            })
          }
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <MessageSquareCode className="w-4 h-4 text-cyan-300" />
          <span>Get Help with an Order</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {DEMO_ORDERS.map((order) => {
          const isDelayed = order.status === 'refund_delayed'
          return (
            <div
              key={order.id}
              className={`p-6 rounded-3xl bg-slate-900/70 border transition-all ${
                isDelayed
                  ? 'border-amber-500/40 bg-amber-500/5 shadow-xl shadow-amber-500/5'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-base font-bold text-white">{order.order_number}</span>
                    {isDelayed ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Refund delayed — 8 days
                      </span>
                    ) : order.status === 'delivered' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        Processing
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 font-medium">{order.items_summary}</p>
                  <p className="text-xs text-slate-500 font-mono">
                    Placed: {new Date(order.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Amount & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-slate-500 block">Total Amount</span>
                    <span className="text-lg font-bold text-white">₹{order.amount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        navigate('/customer/support', {
                          state: {
                            prefillPrompt: `I would like to check the details and status for my order ${order.order_number}.`,
                            autoSend: true,
                          },
                        })
                      }
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquareCode className="w-3.5 h-3.5 text-blue-400" />
                      <span>Ask AI Support</span>
                    </button>

                    {isDelayed && (
                      <button
                        onClick={() =>
                          navigate('/customer/support', {
                            state: {
                              prefillPrompt:
                                "I requested a refund 8 days ago. It still hasn't arrived. This is the second time I'm facing this issue.",
                              autoSend: true,
                            },
                          })
                        }
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Get Help</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
