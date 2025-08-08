import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CSpinner } from '@coreui/react'

const ProtectedRoute = ({ children, permission }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('====permission=====>>>')
  console.log('location:', location)
  console.log('====permission=====<<<')


  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to="/error/403" replace />
  }

  return children
}

const hasPermission = (user, permission) => {
  if (!user || !permission) return true


  console.log('hasPermission=====>>>')
  console.log('permission:', permission)
  console.log('permission.split(:):', permission.split(':'))
  console.log('user:', user)
  console.log('userRole:', user.user_metadata?.role || user.role)
  console.log('hasPermission=====<<<')

  const userRole = user.user_metadata?.role || user.role

  if (userRole === 'super_admin') return true

  const [module, action] = permission.split(':')

  const rolePermissions = {
    business_owner: ['dashboard', 'appointments', 'schedule', 'staff', 'clients', 'services', 'analytics', 'settings'],
    employee: ['dashboard', 'appointments', 'schedule', 'staff', 'clients'],
    client: ['dashboard'],
  }

  return rolePermissions[userRole]?.includes(module) || false
}

export default ProtectedRoute
