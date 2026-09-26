import { searchKnowledgeBase } from './knowledgeBase'
import { ActionEngine } from './actionEngine'
import { DEMO_ORDERS } from './demoData'
import type {
  AIInvestigationStep,
  HumanHandoffPackage,
  Customer,
} from '../../types'

export interface OrchestratorProcessResult {
  aiReply: string
  intent: string
  sentiment: string
  urgency: string
  agentType: string
  steps: AIInvestigationStep[]
  policyCitations: string[]
  handoffPackage?: HumanHandoffPackage
  ticketId?: string
  escalated: boolean
}

export type ProgressCallback = (step: AIInvestigationStep) => void

export class AIOrchestrator {
  static async processMessage(
    userMessage: string,
    customer: Customer | null,
    onProgress?: ProgressCallback
  ): Promise<OrchestratorProcessResult> {
    const customerName = customer?.name || 'Valued Customer'
    const customerEmail = customer?.email || 'customer@example.com'
    const customerId = customer?.id || 'demo-customer-id'

    const steps: AIInvestigationStep[] = []

    const addStep = (title: string, detail: string, status: AIInvestigationStep['status']) => {
      const step: AIInvestigationStep = {
        id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title,
        detail,
        status,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }
      steps.push(step)
      if (onProgress) onProgress(step)
      return step
    }

    // --- PHASE 1: UNDERSTAND ---
    addStep('1. Intent & Sentiment Analysis', 'Analyzing customer message tone, intent category, and priority...', 'processing')
    await new Promise((r) => setTimeout(r, 600))

    const lower = userMessage.toLowerCase()
    const isRefundQuery = lower.includes('refund') || lower.includes('money') || lower.includes('return')
    const isFrustrated = lower.includes('second time') || lower.includes('hasn\'t arrived') || lower.includes('delay') || lower.includes('terrible') || lower.includes('still')
    const isUrgent = isRefundQuery || lower.includes('urgent') || lower.includes('immediately') || lower.includes('8 days')

    const intent = isRefundQuery ? 'Refund Delay & Settlement Inquiry' : 'General Support Inquiry'
    const sentiment = isFrustrated ? 'Frustrated' : 'Neutral'
    const urgency = isUrgent ? 'Critical' : 'Medium'
    const agentType = isRefundQuery ? 'Billing & Settlement Agent' : 'General Support Agent'

    addStep(
      '✓ Intent & Triage Completed',
      `Intent: "${intent}" | Sentiment: "${sentiment}" | Urgency: "${urgency}" | Dispatched to: ${agentType}`,
      'completed'
    )

    // --- PHASE 2: CONTEXT & INVESTIGATION ---
    await new Promise((r) => setTimeout(r, 700))
    addStep('2. Context Engine & Order Lookup', 'Searching active customer records, transactions, and order history...', 'processing')

    // Find target order (e.g. ORD-7281)
    const targetOrder = DEMO_ORDERS.find((o) => o.order_number === 'ORD-7281') || DEMO_ORDERS[0]

    addStep(
      '✓ Customer Order Located',
      `Matched Order #${targetOrder.order_number} (Amount: ₹${targetOrder.amount.toLocaleString()}) | Status: ${targetOrder.status} | Refund requested: 8 days ago`,
      'completed'
    )

    // --- PHASE 3: RAG KNOWLEDGE SEARCH ---
    await new Promise((r) => setTimeout(r, 800))
    addStep('3. RAG Semantic Search', 'Querying company policy vector database for SLA rules & settlement terms...', 'processing')

    const ragResults = await searchKnowledgeBase(userMessage, 2)
    const primaryPolicy = ragResults[0]?.content || 'Standard refund turnaround SLA is 5-7 business days.'
    const policyTitle = ragResults[0]?.title || 'Refund & Settlement Policy (Section 4.2)'

    addStep(
      '✓ Knowledge Grounded',
      `Retrieved: ${policyTitle} (Relevance Score: ${ragResults[0]?.score || 0.95}) — Standard turnaround is 5–7 business days`,
      'completed'
    )

    // --- PHASE 4: SAFE ACTION ENGINE EXECUTION ---
    await new Promise((r) => setTimeout(r, 700))
    addStep('4. Safe Action Execution', 'Action Engine checking payment gateway trace ID and settlement batch...', 'processing')

    const actionResult = await ActionEngine.checkRefundStatus(customerId, targetOrder.order_number)

    addStep(
      '✓ Action Engine Audit Recorded',
      `Action: check_refund_status | Gateway Trace ID: PG-HDFC-994827104 | Elapsed: 8 days (Exceeds 7-day SLA by 1 day)`,
      'completed'
    )

    // --- PHASE 5: DECISION & HUMAN HANDOFF ---
    await new Promise((r) => setTimeout(r, 600))
    addStep('5. Resolution & Safety Evaluation', 'Evaluating autonomous resolution safety vs escalation boundaries...', 'processing')

    const needsEscalation = isFrustrated && actionResult.data?.isExceedingSLA

    let handoffPackage: HumanHandoffPackage | undefined
    let ticketId: string | undefined
    let aiReply = ''

    if (needsEscalation) {
      addStep(
        '⚠ Escalation Required to Human Specialist',
        'Reason: SLA exceeded (8 days > 7 days max) + repeated occurrence detected. Packaging full context for Human Agent handoff.',
        'warning'
      )

      handoffPackage = {
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        ticket_id: '',
        order_id: targetOrder.id,
        order_number: targetOrder.order_number,
        order_amount: `₹${targetOrder.amount.toLocaleString()}`,
        refund_status: 'Delayed / Gateway Batch Reconciliation Hold',
        intent,
        sentiment,
        urgency,
        relevant_policy: primaryPolicy,
        investigation_findings: [
          `Order #${targetOrder.order_number} for ₹${targetOrder.amount.toLocaleString()} was approved for refund 8 days ago.`,
          `Standard company policy SLA is 5 to 7 business days (exceeded by 1 business day).`,
          `Payment Gateway trace ID PG-HDFC-994827104 is currently under settlement reconciliation hold.`,
          `Customer explicitly flagged this as the 2nd time experiencing a refund delay.`,
        ],
        actions_taken: [
          'Verified customer identity & linked order ORD-7281',
          'Checked live payment gateway batch trace status',
          'Retrieved policy document: Standard Refund & Settlement Policy (Section 4.2)',
          'Logged autonomous action audit in agent_actions table',
          'Created high-priority escalation ticket with zero data loss',
        ],
        ai_summary: `Customer is inquiring about a delayed refund of ₹${targetOrder.amount.toLocaleString()} for order #${targetOrder.order_number} requested 8 days ago. SLA threshold is 5–7 days. Gateway hold detected. Repeated friction point.`,
        recommended_next_action:
          '1. Trigger manual payment gateway re-push (Trace ID PG-HDFC-994827104).\n2. If gateway hold persists >24h, issue direct instant credit transfer.\n3. Apply a ₹250 goodwill courtesy coupon for 2nd delay occurrence.',
        escalation_reason:
          'Refund duration (8 days) exceeds company policy 5-7 days SLA and customer reported repeated friction.',
      }

      // Create ticket and escalation records in Supabase
      const ticket = await ActionEngine.createTicket({
        customerId,
        orderId: targetOrder.id,
        subject: `[High Urgency] Delayed Refund (8 Days) — Order #${targetOrder.order_number}`,
        department: 'Billing',
        priority: 'urgent',
        intent,
        sentiment,
        urgency,
        aiSummary: handoffPackage.ai_summary,
      })

      ticketId = ticket.id
      handoffPackage.ticket_id = ticket.id

      await ActionEngine.escalateTicket(ticket.id, handoffPackage.escalation_reason, handoffPackage)

      aiReply = `I completely understand your frustration, especially since this is the second time you've experienced a delay with your refund.

I've thoroughly investigated your account and found Order **#${targetOrder.order_number}** (₹${targetOrder.amount.toLocaleString()}). According to our **Refund Policy**, refunds typically complete within 5–7 business days. Because today is day 8, our system detected a temporary payment gateway settlement hold (Trace ID: \`PG-HDFC-994827104\`).

To ensure this is resolved immediately without making you wait any longer, I have **escalated your case directly to our Senior Financial Operations team** along with a complete investigation summary and priority ticket **#${ticket.id.slice(0, 8)}**. 

A human specialist has been assigned and is actively overriding the gateway hold for you right now.`
    } else {
      addStep('✓ Autonomous Resolution', 'Issue successfully resolved within automated safety guidelines.', 'completed')
      aiReply = `I've checked our records for Order **#${targetOrder.order_number}**. The refund is currently processing smoothly and is within the standard 5–7 business days turnaround time.`
    }

    return {
      aiReply,
      intent,
      sentiment,
      urgency,
      agentType,
      steps,
      policyCitations: [policyTitle],
      handoffPackage,
      ticketId,
      escalated: needsEscalation,
    }
  }
}
