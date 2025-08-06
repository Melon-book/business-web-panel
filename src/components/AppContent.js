import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ProtectedRoute from './ProtectedRoute'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map(({ path, name, element: Element, permission, exact }, idx) => {
            return (
              Element && (
                <Route
                  key={idx}
                  path={path}
                  exact={exact}
                  name={name}
                  element={
                    <ProtectedRoute permission={permission}>
                      <Element />
                    </ProtectedRoute>
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
