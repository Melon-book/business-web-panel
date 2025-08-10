import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

const ProtectedRoute = ({ children, permission }) => {
  const loading = false
  const user = {}
  const location = useLocation()

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

  // TOODO: Implement actual permission checking logic
  // For now, we assume the user has the permission if it exists
  return true
}

export default ProtectedRoute
