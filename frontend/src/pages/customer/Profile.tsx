import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../services/supabase'
import type { Ticket } from '../../types'
import { DEMO_INITIAL_TICKETS } from '../../services/ai/demoData'
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Edit3,
  X,
  LogOut,
  Ticket as TicketIcon,
  ChevronRight,
  Send,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { profile, user, customer, role, refreshProfile, signOut } = useAuth()

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phoneNumber, setPhoneNumber] = useState(customer?.phone || '+91 98765 43210')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Security / Password Reset State
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  // Notification / Support Preferences (Stateful)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [escalationAlerts, setEscalationAlerts] = useState(true)
  const [refundAlerts, setRefundAlerts] = useState(true)

  // Recent Activity State
  const [userTickets, setUserTickets] = useState<Ticket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)

  // Sync edit form with profile data
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name)
    if (customer?.phone) setPhoneNumber(customer.phone)
  }, [profile, customer])

  // Fetch recent tickets for activity section
  useEffect(() => {
    async function loadActivity() {
      try {
        setLoadingTickets(true)
        const { data } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)

        if (data && data.length > 0) {
          setUserTickets(data as Ticket[])
        } else {
          setUserTickets(DEMO_INITIAL_TICKETS)
        }
      } catch (err) {
        setUserTickets(DEMO_INITIAL_TICKETS)
      } finally {
        setLoadingTickets(false)
      }
    }
    loadActivity()
  }, [])

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      if (user) {
        // 1. Update public.users
        await supabase
          .from('users')
          .update({ full_name: fullName })
          .eq('id', user.id)

        // 2. Update public.customers
        await supabase
          .from('customers')
          .update({ name: fullName, phone: phoneNumber })
          .eq('user_id', user.id)

        // 3. Refresh Auth context state
        await refreshProfile()
      }
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err) {
      setSaveError('Failed to save profile changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Password Reset Link
  const handleSendPasswordReset = async () => {
    if (!user?.email) return
    setResetLoading(true)
    try {
      await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + '/login',
      })
      setResetSent(true)
      setTimeout(() => setResetSent(false), 6000)
    } catch (err) {
      console.warn('Password reset request error:', err)
    } finally {
      setResetLoading(false)
    }
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'September 2026'

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Active Session'

  const roleLabel =
    role === 'admin'
      ? 'Administrator'
      : role === 'agent'
      ? 'Support Specialist'
      : 'Customer'

  const roleBadgeStyle =
    role === 'admin'
      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
      : role === 'agent'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      : 'bg-blue-500/15 text-blue-300 border-blue-500/30'

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Account Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, account credentials, support preferences, and view recent activity.
        </p>
      </div>

      {/* Success / Error Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your profile information has been successfully updated in the database.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 1. Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-xl shadow-blue-500/20 shrink-0">
                {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-slate-900 flex items-center justify-center" title="Active Account">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            {/* Identity Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User Profile'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${roleBadgeStyle}`}>
                  {roleLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{user?.email || 'customer@example.com'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" /> Member since {memberSince}
                </span>
              </p>
            </div>
          </div>

          {/* Edit / Action Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isEditing
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Editing</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Personal Info + Account Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Personal Info & Support Preferences) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Personal Information */}
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Personal Information</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Account ID: #{user?.id?.slice(0, 8) || 'USR-7281'}
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 px-4 py-2.5 text-sm text-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address (Auth ID)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full rounded-xl bg-slate-950/50 border border-slate-800/60 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Email is linked to Supabase Authentication credentials.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Contact Phone</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 px-4 py-2.5 text-sm text-white outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Full Name</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {profile?.full_name || 'Not provided'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate" title={user?.email}>
                    {user?.email || 'customer@example.com'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Contact Phone</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {customer?.phone || phoneNumber || '+91 98765 43210'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Account Authorization</span>
                  </div>
                  <p className="text-sm font-semibold text-white capitalize">
                    {roleLabel} Tier
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Support & Notification Preferences */}
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>Support & Resolution Preferences</span>
              </h3>
              <span className="text-[11px] text-slate-500">Live Preferences</span>
            </div>

            <div className="space-y-3.5">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-all">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-200 block">
                    AI Autonomous Resolution Notifications
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Receive email receipts when SupportIQ resolves routine order inquiries.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-all">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-200 block">
                    Human Escalation Status Updates
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Notify me when high-priority tickets are assigned to Senior Operations specialists.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={escalationAlerts}
                  onChange={(e) => setEscalationAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-all">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-200 block">
                    Gateway Settlement Milestones
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Real-time status updates when payment refund trace batches settle.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={refundAlerts}
                  onChange={(e) => setRefundAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (Security & Recent Activity) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Account Security Card */}
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>Account Security</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Authentication Method</span>
                <span className="font-semibold text-slate-200">Email & Encrypted Password</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Last Active Sign-in</span>
                <span className="font-mono text-slate-300">{lastSignIn}</span>
              </div>

              {resetSent && (
                <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px]">
                  Password reset link dispatched to <strong>{user?.email}</strong>.
                </div>
              )}

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  disabled={resetLoading || resetSent}
                  onClick={handleSendPasswordReset}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>{resetLoading ? 'Dispatching...' : 'Send Password Reset Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={signOut}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Current Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Support Activity */}
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-amber-400" />
                <span>Recent Support Activity</span>
              </h3>
              <Link to="/customer/tickets" className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All Tickets <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingTickets ? (
              <p className="text-xs text-slate-500">Loading recent tickets...</p>
            ) : userTickets.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                No recent support tickets filed.
              </div>
            ) : (
              <div className="space-y-2.5">
                {userTickets.map((t) => {
                  const isEscalated = t.status === 'escalated'
                  return (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-bold text-slate-400">
                          #{t.id.slice(0, 8)}
                        </span>
                        {isEscalated ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Escalated
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-1">{t.subject}</p>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(t.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
