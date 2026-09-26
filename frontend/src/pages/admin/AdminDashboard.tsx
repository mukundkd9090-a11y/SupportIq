import { useState } from 'react'
import { DEMO_KNOWLEDGE_DOCS } from '../../services/ai/demoData'
import {
  BarChart3,
  BookOpen,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Activity,
  Database,
  Plus,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'knowledge' | 'actions'>('analytics')
  const [docs, setDocs] = useState(DEMO_KNOWLEDGE_DOCS)
  const [showAddDoc, setShowAddDoc] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Billing & Refunds')
  const [newContent, setNewContent] = useState('')

  const intentData = [
    { name: 'Refund Inquiry', count: 48, fill: '#3b82f6' },
    { name: 'Order Status', count: 35, fill: '#06b6d4' },
    { name: 'Warranty Claim', count: 22, fill: '#8b5cf6' },
    { name: 'Cancellation', count: 18, fill: '#10b981' },
    { name: 'Account / 2FA', count: 9, fill: '#f59e0b' },
  ]

  const resolutionData = [
    { name: 'Autonomous AI Resolved', value: 78, color: '#10b981' },
    { name: 'Human Escalated', value: 22, color: '#f59e0b' },
  ]

  const auditLogs = [
    {
      id: 'act-1',
      action: 'check_refund_status',
      agent: 'Billing & Settlement Agent',
      status: 'success',
      target: 'ORD-7281 (Priya Sharma)',
      time: '2 mins ago',
    },
    {
      id: 'act-2',
      action: 'rag_vector_search',
      agent: 'AI Orchestrator',
      status: 'success',
      target: 'Refund Policy Section 4.2',
      time: '2 mins ago',
    },
    {
      id: 'act-3',
      action: 'escalate_ticket',
      agent: 'Orchestrator Safety Guard',
      status: 'requires_human_approval',
      target: 'TKT-7281 (Exceeds SLA threshold)',
      time: '2 mins ago',
    },
    {
      id: 'act-4',
      action: 'check_order_status',
      agent: 'Order Agent',
      status: 'success',
      target: 'ORD-9042 (Autonomous Lookup)',
      time: '14 mins ago',
    },
  ]

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newContent) return
    const newDoc = {
      id: `kb-doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      description: 'Custom added policy',
    }
    setDocs([newDoc, ...docs])
    setShowAddDoc(false)
    setNewTitle('')
    setNewContent('')
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-semibold text-purple-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>SupportIQ Control Plane</span>
          </div>
          <h1 className="text-2xl font-bold text-white">System Administration & Knowledge Base</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor autonomous AI resolution rates, RAG policy embeddings, and safe action execution logs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'knowledge', label: 'Knowledge Base (RAG)', icon: BookOpen },
            { id: 'actions', label: 'Action Audit Log', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Total Queries Triage</span>
              <p className="text-3xl font-extrabold text-white">1,428</p>
              <p className="text-xs text-emerald-400 font-medium">+18.4% this week</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">AI Autonomous Resolved</span>
              <p className="text-3xl font-extrabold text-emerald-400">78.0%</p>
              <p className="text-xs text-slate-400 font-medium">1,114 queries without human</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Human Escalation Rate</span>
              <p className="text-3xl font-extrabold text-amber-400">22.0%</p>
              <p className="text-xs text-amber-400 font-medium">100% full context retention</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Avg Triage Latency</span>
              <p className="text-3xl font-extrabold text-cyan-400">1.4s</p>
              <p className="text-xs text-slate-400 font-medium">pgvector + RAG speed</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Intent Breakdown Chart */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Top Customer Intent Categories</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={intentData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resolution Distribution */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>AI Resolution vs Human Escalation Ratio</span>
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resolutionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {resolutionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE BASE & RAG */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <span>RAG Knowledge Documents ({docs.length})</span>
              </h2>
              <p className="text-xs text-slate-400">Indexed for real-time semantic retrieval via pgvector embeddings.</p>
            </div>

            <button
              onClick={() => setShowAddDoc(!showAddDoc)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Knowledge Policy</span>
            </button>
          </div>

          {showAddDoc && (
            <form onSubmit={handleAddDocument} className="p-6 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-4">
              <h3 className="text-sm font-bold text-white">Create New Grounding Policy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Document Title (e.g. Return Policy Section 2.1)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                >
                  <option value="Billing & Refunds">Billing & Refunds</option>
                  <option value="Orders">Orders</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Account">Account</option>
                </select>
              </div>
              <textarea
                placeholder="Policy details and resolution rules..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoc(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-semibold text-xs"
                >
                  Save & Index
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc) => (
              <div key={doc.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Embedding: 1536-dim Active</span>
                </div>
                <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{doc.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACTION ENGINE AUDIT LOG */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Action Engine Execution Stream</span>
              </h2>
              <p className="text-xs text-slate-400">All autonomous actions logged into PostgreSQL `agent_actions` table.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-800">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{log.action}</span>
                        <span className="text-slate-400">• {log.agent}</span>
                      </div>
                      <p className="text-slate-400 mt-0.5">{log.target}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {log.status === 'success' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        SUCCESS
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        REQUIRES_HUMAN
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-mono">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
