import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../types'
import { Bot, Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full bg-blue-500/20 animate-ping" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bot className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mt-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span>Authenticating SupportIQ session...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to default home for their role
    if (role === 'admin') return <Navigate to="/admin/analytics" replace />
    if (role === 'agent') return <Navigate to="/agent/queue" replace />
    return <Navigate to="/customer/dashboard" replace />
  }

  return <>{children}</>
}
