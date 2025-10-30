import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AdminDashboard from '../pages/admin/Dashboard'
import VesselsPage from '../pages/admin/Vessels'
import MyBookings from '../pages/user/MyBookings'
import Catalog from '../pages/public/Catalog'
import { isAuthed, getRole } from '../lib/auth'
import AdminLayout from '../layouts/AdminLayout'  // <- layout mới

function Protected({ children }: { children: ReactNode }) {
  return isAuthed() ? <>{children}</> : <Navigate to="/login" replace />
}

function RequireRole({ role, children }: { role: 'ADMIN' | 'USER'; children: ReactNode }) {
  const loc = useLocation()
  if (getRole() !== role) {
    return <Navigate to="/login" replace state={{ from: loc.pathname, require: role }} />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  // PUBLIC
  { path: '/', element: <Catalog /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  // USER
  {
    path: '/me/bookings',
    element: (
      <Protected>
        <RequireRole role="USER"><MyBookings /></RequireRole>
      </Protected>
    ),
  },

  // ADMIN (bọc layout)
  {
    path: '/admin',
    element: (
      <Protected>
        <RequireRole role="ADMIN">
          <AdminLayout />
        </RequireRole>
      </Protected>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'vessels', element: <VesselsPage /> },
      // có thể thêm các trang khác ở đây…
    ],
  },

  // Redirect cũ
  { path: '/admin/dashboard', element: <Navigate to="/admin" replace /> },

  // 404 → về Catalog
  { path: '*', element: <Navigate to="/" replace /> },
])
