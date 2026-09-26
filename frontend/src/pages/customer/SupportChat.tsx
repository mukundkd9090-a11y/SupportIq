import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AIOrchestrator } from '../../services/ai/orchestrator'
import type { Message, AIInvestigationStep, HumanHandoffPackage } from '../../types'
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  RefreshCw,
  Cpu,
} from 'lucide-react'

export default function SupportChat() {
  const { customer, user } = useAuth()
  const location = useLocation()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      ticket_id: 'initial',
      sender_type: 'ai',
      content:
        "Hello! I am SupportIQ, your autonomous customer resolution assistant. I can investigate your orders, review policy terms, safely execute resolution actions, or connect you with human specialists with zero data loss. How can I help you today?",
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const [isProcessing, setIsProcessing] = useState(false)
  const [activeSteps, setActiveSteps] = useState<AIInvestigationStep[]>([])
  const [activeHandoff, setActiveHandoff] = useState<HumanHandoffPackage | null>(null)
  const [showHandoffDetails, setShowHandoffDetails] = useState(false)
  const prefillSentRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeSteps])

  // Handle prefill prompt from Dashboard or Orders page — fire ONCE only
  useEffect(() => {
    if (location.state?.prefillPrompt && !prefillSentRef.current) {
      const prompt = location.state.prefillPrompt as string
      if (location.state?.autoSend) {
        prefillSentRef.current = true
        // Call with explicit prompt to avoid reading stale inputMessage state
        handleSendMessage(prompt)
      } else {
        setInputMessage(prompt)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim()
    if (!query || isProcessing) return

    setInputMessage('')
    setIsProcessing(true)
    setActiveSteps([])
    setActiveHandoff(null)

    // Add user message to state
    const userMsg: Message = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ticket_id: 'chat',
      sender_type: 'customer',
      sender_id: user?.id,
      content: query,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])

    try {
      const result = await AIOrchestrator.processMessage(
        query,
        customer,
        (newStep) => {
          setActiveSteps((prev) => {
            const existingIdx = prev.findIndex((s) => s.id === newStep.id)
            if (existingIdx >= 0) {
              const updated = [...prev]
              updated[existingIdx] = newStep
              return updated
            }
            return [...prev, newStep]
          })
        }
      )

      if (result.handoffPackage) {
        setActiveHandoff(result.handoffPackage)
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        ticket_id: result.ticketId || 'chat',
        sender_type: 'ai',
        content: result.aiReply,
        metadata: {
          intent: result.intent,
          sentiment: result.sentiment,
          urgency: result.urgency,
          agent_type: result.agentType,
          investigation_steps: result.steps,
          policy_citations: result.policyCitations,
          escalation_package: result.handoffPackage,
        },
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          ticket_id: 'chat',
          sender_type: 'ai',
          content:
            "I encountered a momentary connection interruption while querying our backend services. Please try again or re-state your request.",
          created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const demoSuggestions = [
    {
      label: '⚡ Flagship Hackathon Demo (Refund Delay & Escalation)',
      text: "I requested a refund 8 days ago. It still hasn't arrived. This is the second time I'm facing this issue.",
    },
    {
      label: '📦 Order Cancellation Inquiry',
      text: 'Can I cancel my recent order #ORD-9042 before it ships?',
    },
    {
      label: '🛡️ Warranty Policy Question',
      text: 'What is the manufacturer replacement warranty policy for audio headphones?',
    },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-xl overflow-hidden animate-fadeIn">
      {/* Top Chat Header with Live Agent Status */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">SupportIQ Autonomous Assistant</h2>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                RAG + Safety Online
              </span>
            </div>
            <p className="text-xs text-slate-400">Context Engine • pgvector RAG • Human Handoff Bridge</p>
          </div>
        </div>

        {/* Demo Quick Reset */}
        <button
          onClick={() => {
            setMessages([
              {
                id: 'msg-welcome',
                ticket_id: 'initial',
                sender_type: 'ai',
                content:
                  "Hello! I am SupportIQ, your autonomous customer resolution assistant. I can investigate your orders, review policy terms, safely execute resolution actions, or connect you with human specialists with zero data loss. How can I help you today?",
                created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
            setActiveSteps([])
            setActiveHandoff(null)
          }}
          title="Reset conversation"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender_type === 'customer'
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-gradient-to-tr from-slate-700 to-slate-800 text-slate-200 border border-slate-600'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`space-y-2 max-w-xl ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                      : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/60 shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* AI Investigation Meta Badge Cards */}
                {!isUser && msg.metadata && (
                  <div className="space-y-2 pt-1">
                    {/* Transparent Stage Indicators */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {msg.metadata.intent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300">
                          <Cpu className="w-3 h-3 text-blue-400" />
                          <span>Intent: {msg.metadata.intent}</span>
                        </span>
                      )}
                      {msg.metadata.sentiment && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                          <span>Sentiment: {msg.metadata.sentiment}</span>
                        </span>
                      )}
                      {msg.metadata.urgency && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300">
                          <span>Urgency: {msg.metadata.urgency}</span>
                        </span>
                      )}
                      {msg.metadata.policy_citations && msg.metadata.policy_citations.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                          <BookOpen className="w-3 h-3 text-indigo-400" />
                          <span>RAG: {msg.metadata.policy_citations[0]}</span>
                        </span>
                      )}
                    </div>

                    {/* View Human Handoff Package Trigger if escalated */}
                    {msg.metadata.escalation_package && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-semibold">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Zero-Data-Loss Human Handoff Package Generated</span>
                          </div>
                          <button
                            onClick={() => {
                              setActiveHandoff(msg.metadata?.escalation_package || null)
                              setShowHandoffDetails(true)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold underline cursor-pointer transition-all"
                          >
                            Inspect Package
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-300/80">
                          Ticket #{(msg.metadata.escalation_package.ticket_id || 'TKT-7281').slice(0, 8)} created & assigned to Senior Financial Operations with complete historical context.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <span className="text-[10px] text-slate-500 block px-1">{msg.created_at}</span>
              </div>
            </div>
          )
        })}

        {/* Live Multi-stage AI Investigation HUD during active processing */}
        {isProcessing && (
          <div className="rounded-2xl bg-slate-950/80 border border-blue-500/30 p-5 space-y-4 shadow-xl backdrop-blur-md animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                <span>SupportIQ Multi-Agent Investigation in Progress...</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Live Agent Pipeline</span>
            </div>

            <div className="space-y-2.5">
              {activeSteps.map((step) => {
                const isWarning = step.status === 'warning'
                const isDone = step.status === 'completed'
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs transition-all ${
                      isWarning
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : isDone
                        ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                        : 'bg-blue-600/10 border-blue-500/30 text-blue-300'
                    }`}
                  >
                    {isWarning ? (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-400 animate-spin shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="px-6 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Prompts:
        </span>
        {demoSuggestions.map((item, idx) => (
          <button
            key={idx}
            disabled={isProcessing}
            onClick={() => handleSendMessage(item.text)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/40 text-[11px] font-medium text-slate-300 hover:text-white transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800/80">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isProcessing}
            placeholder="Type your issue or query (e.g. 'I requested a refund 8 days ago...')"
            className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-blue-500/50 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isProcessing}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Human Handoff Package Inspector Modal */}
      {showHandoffDetails && activeHandoff && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <ShieldAlert className="w-5 h-5" />
                <span>Zero-Data-Loss Contextual Handoff Package</span>
              </div>
              <button
                onClick={() => setShowHandoffDetails(false)}
                className="text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Customer</span>
                <span className="font-semibold text-slate-200">{activeHandoff.customer_name}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Order</span>
                <span className="font-mono font-semibold text-blue-400">{activeHandoff.order_number}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Amount</span>
                <span className="font-semibold text-emerald-400">{activeHandoff.order_amount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Urgency</span>
                <span className="font-bold text-red-400">{activeHandoff.urgency}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Relevant Policy SLA</span>
                <p className="text-slate-300 leading-relaxed">{activeHandoff.relevant_policy}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-semibold block">Investigation Findings</span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {activeHandoff.investigation_findings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-semibold block">Actions Already Taken by AI</span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {activeHandoff.actions_taken.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <span className="text-amber-300 font-bold block">Recommended Next Best Action for Agent</span>
                <p className="text-amber-200 whitespace-pre-line leading-relaxed">
                  {activeHandoff.recommended_next_action}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
