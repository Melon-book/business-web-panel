import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'))
const AppointmentsList = React.lazy(() => import('../features/appointments/pages/AppointmentsList'))
const ScheduleView = React.lazy(() => import('../features/schedule/pages/ScheduleView'))
const StaffList = React.lazy(() => import('../features/staff/pages/StaffList'))
const ClientsList = React.lazy(() => import('../features/clients/pages/ClientsList'))
const ServicesList = React.lazy(() => import('../features/services/pages/ServicesList'))
const AnalyticsDashboard = React.lazy(() => import('../features/analytics/pages/AnalyticsDashboard'))
const BusinessSettings = React.lazy(() => import('../features/settings/pages/BusinessSettings'))

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <CContainer lg>
            <Suspense fallback={<CSpinner color="primary" />}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<AppointmentsList />} />
                <Route path="/schedule" element={<ScheduleView />} />
                <Route path="/staff" element={<StaffList />} />
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/services" element={<ServicesList />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/settings" element={<BusinessSettings />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/error/404" replace />} />
              </Routes>
            </Suspense>
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout