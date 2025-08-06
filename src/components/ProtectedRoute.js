import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CSpinner } from '@coreui/react'

const ProtectedRoute = ({ children, permission }) => {
  const { user, loading } = useAuth()

  console.log('--ProtectedRoute--');
  console.log(permission);
  console.log('--ProtectedRoute--');


  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
