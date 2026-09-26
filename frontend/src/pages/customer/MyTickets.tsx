import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { DEMO_INITIAL_TICKETS } from '../../services/ai/demoData'
import type { Ticket } from '../../types'
import {
  Ticket as TicketIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Bot,
  ChevronRight,
} from 'lucide-react'

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(DEMO_INITIAL_TICKETS)

  useEffect(() => {
    async function loadTickets() {
      try {
        const { data } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false })

        if (data && data.length > 0) {
          // Merge with demo tickets
          setTickets([...data, ...DEMO_INITIAL_TICKETS])
        }
      } catch (e) {
        // Fallback
      }
    }
    loadTickets()
  }, [])

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <TicketIcon className="w-6 h-6 text-amber-400" />
            <span>Support Tickets & Escalations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status of your autonomous AI investigations and prioritized human handoffs.
          </p>
        </div>

        <Link
          to="/customer/support"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Bot className="w-4 h-4 text-cyan-300" />
          <span>New AI Support Request</span>
        </Link>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const isUrgent = ticket.priority === 'urgent' || ticket.priority === 'high'
          const isEscalated = ticket.status === 'escalated'

          return (
            <div
              key={ticket.id}
              className={`p-6 rounded-3xl bg-slate-900/70 border transition-all ${
                isEscalated
                  ? 'border-amber-500/40 bg-amber-500/5 shadow-xl shadow-amber-500/5'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{ticket.id.slice(0, 8)}
                    </span>

                    {isEscalated ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        Human Specialist Assigned
                      </span>
                    ) : ticket.status === 'resolved' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Investigating
                      </span>
                    )}

                    {isUrgent && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Priority: Urgent
                      </span>
                    )}

                    {ticket.department && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        Dept: {ticket.department}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{ticket.subject}</h3>

                  {ticket.ai_summary && (
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI Autonomous Investigation Summary</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{ticket.ai_summary}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-4 shrink-0">
                  <div className="text-right text-xs text-slate-500">
                    <span>Created</span>
                    <p className="font-mono text-slate-300">
                      {new Date(ticket.created_at || '').toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    to="/customer/support"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    <span>Open Live Chat</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
