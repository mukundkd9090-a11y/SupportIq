import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/customer/Login'
import Signup from './pages/customer/Signup'
import CustomerLayout from './components/layout/CustomerLayout'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import SupportChat from './pages/customer/SupportChat'
import MyOrders from './pages/customer/MyOrders'
import MyTickets from './pages/customer/MyTickets'
import Profile from './pages/customer/Profile'
import AgentDashboard from './pages/agent/AgentDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Customer Portal (Protected) */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="support" element={<SupportChat />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="tickets" element={<MyTickets />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Agent Desk (Protected) */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/agent/queue" replace />} />
        <Route path="queue" element={<AgentDashboard />} />
      </Route>

      {/* Admin Dashboard (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/analytics" replace />} />
        <Route path="analytics" element={<AdminDashboard />} />
      </Route>

      {/* Legacy / Shortcut Aliases */}
      <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/customer/dashboard" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
    </Routes>
  )
}

export default App