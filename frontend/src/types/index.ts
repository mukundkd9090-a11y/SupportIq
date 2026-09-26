export type UserRole = 'customer' | 'agent' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id: string
  user_id?: string | null
  name: string
  email: string
  phone?: string | null
  created_at?: string
  updated_at?: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refund_delayed'
  | 'refunded'

export interface Order {
  id: string
  customer_id: string
  order_number: string
  amount: number
  status: OrderStatus
  created_at?: string
  updated_at?: string
  items_summary?: string
  refund_requested_days_ago?: number
}

export type TicketStatus = 'open' | 'investigating' | 'resolved' | 'escalated'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type Department = 'Billing' | 'Orders' | 'Technical' | 'Account' | 'General'

export interface Ticket {
  id: string
  customer_id: string
  order_id?: string | null
  status: TicketStatus
  priority: TicketPriority
  subject: string
  department?: Department | null
  ai_summary?: string | null
  assigned_agent_id?: string | null
  created_at?: string
  updated_at?: string
  resolved_at?: string | null
  intent?: string
  sentiment?: 'Positive' | 'Neutral' | 'Frustrated' | 'Angry'
  urgency?: 'Low' | 'Medium' | 'High' | 'Critical'
}

export type SenderType = 'customer' | 'ai' | 'agent' | 'system'

export interface MessageMetadata {
  intent?: string
  sentiment?: string
  urgency?: string
  agent_type?: string
  investigation_steps?: AIInvestigationStep[]
  action_performed?: string
  policy_citations?: string[]
  escalation_package?: HumanHandoffPackage
  is_automated?: boolean
}

export interface Message {
  id: string
  ticket_id: string
  sender_type: SenderType
  sender_id?: string | null
  content: string
  metadata?: MessageMetadata | null
  created_at?: string
}

export interface KnowledgeDocument {
  id: string
  title: string
  description?: string | null
  category: string
  content: string
  source_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface KnowledgeChunk {
  id: string
  document_id: string
  chunk_index: number
  content: string
  embedding?: number[]
  metadata?: Record<string, any>
  created_at?: string
}

export interface AgentAction {
  id: string
  ticket_id?: string | null
  customer_id?: string | null
  status: 'pending' | 'success' | 'failed' | 'requires_human_approval'
  action_type: string
  agent_type?: string
  error_message?: string | null
  created_at?: string
  details?: Record<string, any>
}

export interface Escalation {
  id: string
  ticket_id: string
  status: 'pending' | 'in_review' | 'resolved'
  assigned_agent_id?: string | null
  reason: string
  ai_summary?: string | null
  resolved_at?: string | null
  created_at?: string
  handoff_package?: HumanHandoffPackage
}

// AI Engine Types
export interface AIInvestigationStep {
  id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'warning' | 'failed'
  detail: string
  timestamp: string
}

export interface HumanHandoffPackage {
  customer_id: string
  customer_name: string
  customer_email: string
  ticket_id: string
  order_id?: string
  order_number?: string
  order_amount?: string | number
  refund_status?: string
  intent: string
  sentiment: string
  urgency: string
  relevant_policy: string
  investigation_findings: string[]
  actions_taken: string[]
  ai_summary: string
  recommended_next_action: string
  escalation_reason: string
}
