import { supabase } from '../supabase'
import { DEMO_ORDERS } from './demoData'
import type { Order, Ticket, Escalation, HumanHandoffPackage } from '../../types'

export interface ActionExecutionResult {
  success: boolean
  actionType: string
  data?: any
  message: string
  actionLogId?: string
}

const isValidUUID = (str?: string | null) =>
  Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str))

export class ActionEngine {
  /**
   * Log an AI autonomous action into the agent_actions table
   */
  static async logAction(
    actionType: string,
    agentType: string,
    status: 'success' | 'failed' | 'requires_human_approval',
    ticketId?: string | null,
    customerId?: string | null,
    errorMessage?: string | null
  ): Promise<string | undefined> {
    try {
      const { data, error } = await supabase
        .from('agent_actions')
        .insert({
          action_type: actionType,
          agent_type: agentType,
          status,
          ticket_id: isValidUUID(ticketId) ? ticketId : null,
          customer_id: isValidUUID(customerId) ? customerId : null,
          error_message: errorMessage || null,
        })
        .select('id')
        .maybeSingle()

      if (error) {
        console.warn('Could not persist agent_action to DB, logged in memory:', error)
      }
      return data?.id
    } catch (err) {
      console.warn('Agent action DB logging fallback:', err)
      return undefined
    }
  }

  /**
   * Safe Action: Investigate order and refund status
   */
  static async checkRefundStatus(
    customerId: string,
    orderNumber?: string
  ): Promise<ActionExecutionResult> {
    // 1. Fetch order from Supabase or fallback demo data
    let targetOrder: Order | undefined
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        targetOrder = orderNumber
          ? data.find((o) => o.order_number === orderNumber)
          : data[0]
      }
    } catch (e) {
      // Fallback
    }

    if (!targetOrder) {
      targetOrder = orderNumber
        ? DEMO_ORDERS.find((o) => o.order_number === orderNumber)
        : DEMO_ORDERS[0]
    }

    // Safety checks & investigation
    const elapsedDays = targetOrder?.refund_requested_days_ago ?? 8
    const isExceedingSLA = elapsedDays > 7

    await this.logAction(
      'check_refund_status',
      'billing_agent',
      'success',
      null,
      customerId
    )

    return {
      success: true,
      actionType: 'check_refund_status',
      data: {
        order: targetOrder,
        orderNumber: targetOrder?.order_number || 'ORD-7281',
        amount: targetOrder?.amount || 4999,
        refundStatus: 'Delayed / Payment Gateway Settlement Batch Hold',
        elapsedDays,
        slaLimitDays: 7,
        isExceedingSLA,
        gatewayTraceId: 'PG-HDFC-994827104',
      },
      message: isExceedingSLA
        ? `Refund for order ${targetOrder?.order_number} has exceeded standard 5-7 business days SLA (${elapsedDays} days elapsed). Gateway batch hold detected.`
        : `Refund is within normal processing window (${elapsedDays}/7 days).`,
    }
  }

  /**
   * Safe Action: Create ticket in Supabase
   */
  static async createTicket(ticketData: {
    customerId: string
    orderId?: string
    subject: string
    department: any
    priority: any
    intent: string
    sentiment: string
    urgency: string
    aiSummary: string
  }): Promise<Ticket> {
    const newTicket: any = {
      subject: ticketData.subject,
      department: ticketData.department,
      priority: ticketData.priority,
      status: 'escalated',
      ai_summary: ticketData.aiSummary,
    }

    if (isValidUUID(ticketData.customerId)) newTicket.customer_id = ticketData.customerId
    if (isValidUUID(ticketData.orderId)) newTicket.order_id = ticketData.orderId

    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert(newTicket)
        .select()
        .single()

      if (!error && data) {
        await this.logAction(
          'create_ticket',
          'orchestrator',
          'success',
          data.id,
          ticketData.customerId
        )
        return data as Ticket
      }
    } catch (e) {
      console.warn('Supabase createTicket fallback:', e)
    }

    // Fallback in-memory ticket
    const fallbackTicket: Ticket = {
      id: `tkt-${Date.now().toString(36)}`,
      customer_id: ticketData.customerId,
      order_id: ticketData.orderId || 'ord-7281-uuid',
      subject: ticketData.subject,
      department: ticketData.department,
      priority: ticketData.priority,
      status: 'escalated',
      ai_summary: ticketData.aiSummary,
      created_at: new Date().toISOString(),
    }
    return fallbackTicket
  }

  /**
   * Safe Action: Escalate ticket with full contextual handoff package
   */
  static async escalateTicket(
    ticketId: string,
    reason: string,
    handoffPackage: HumanHandoffPackage
  ): Promise<Escalation> {
    try {
      if (isValidUUID(ticketId)) {
        const { data, error } = await supabase
          .from('escalations')
          .insert({
            ticket_id: ticketId,
            status: 'pending',
            reason,
            ai_summary: handoffPackage.ai_summary,
          })
          .select()
          .single()

        await this.logAction(
          'escalate_ticket',
          'orchestrator',
          'requires_human_approval',
          ticketId,
          handoffPackage.customer_id
        )

        if (!error && data) {
          return {
            ...data,
            handoff_package: handoffPackage,
          } as Escalation
        }
      }
    } catch (e) {
      console.warn('Supabase escalateTicket fallback:', e)
    }

    const fallbackEscalation: Escalation = {
      id: `esc-${Date.now().toString(36)}`,
      ticket_id: ticketId,
      status: 'pending',
      reason,
      ai_summary: handoffPackage.ai_summary,
      created_at: new Date().toISOString(),
      handoff_package: handoffPackage,
    }
    return fallbackEscalation
  }
}
