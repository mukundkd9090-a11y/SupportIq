import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Bot,
  LayoutDashboard,
  MessageSquareCode,
  Package,
  Ticket as TicketIcon,
  User,
  LogOut,
  ShieldAlert,
  BarChart3,
} from 'lucide-react'

export default function Navbar() {
  const { user, profile, role, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Dynamic Navigation Items strictly based on the user's authentic role
  const customerNavItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'AI Support', path: '/customer/support', icon: MessageSquareCode, highlight: true },
    { name: 'My Orders', path: '/customer/orders', icon: Package },
    { name: 'My Tickets', path: '/customer/tickets', icon: TicketIcon },
    { name: 'Profile', path: '/customer/profile', icon: User },
  ]

  const agentNavItems = [
    { name: 'Escalation Desk', path: '/agent/queue', icon: ShieldAlert, highlight: true },
    { name: 'AI Support', path: '/customer/support', icon: MessageSquareCode },
    { name: 'Orders Inspect', path: '/customer/orders', icon: Package },
    { name: 'Profile', path: '/customer/profile', icon: User },
  ]

  const adminNavItems = [
    { name: 'Analytics & KB', path: '/admin/analytics', icon: BarChart3, highlight: true },
    { name: 'Escalation Desk', path: '/agent/queue', icon: ShieldAlert },
    { name: 'AI Support', path: '/customer/support', icon: MessageSquareCode },
    { name: 'Orders Inspect', path: '/customer/orders', icon: Package },
    { name: 'Profile', path: '/customer/profile', icon: User },
  ]

  const currentNavItems =
    role === 'admin'
      ? adminNavItems
      : role === 'agent'
      ? agentNavItems
      : customerNavItems

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Account'
  const homePath = role === 'admin' ? '/admin/analytics' : role === 'agent' ? '/agent/queue' : '/customer/dashboard'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to={homePath} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SupportIQ
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {currentNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                } ${item.highlight && !isActive ? 'text-cyan-300 font-semibold' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'} ${item.highlight ? 'text-cyan-400' : ''}`} />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side: Authenticated User Badge & Logout */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <Link
            to="/customer/profile"
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/10 shrink-0">
              {(displayName || 'U')[0].toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left max-w-[140px]">
              <span className="text-xs font-semibold text-slate-200 truncate" title={displayName}>
                {displayName}
              </span>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                    role === 'admin'
                      ? 'bg-purple-500/15 text-purple-400'
                      : role === 'agent'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-blue-500/15 text-blue-400'
                  }`}
                >
                  {role}
                </span>
              </div>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 transition-all cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
