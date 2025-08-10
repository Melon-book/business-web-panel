import React from 'react'

const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))
const Sandbox = React.lazy(() => import('./features/sandbox/pages/Sandbox'))
const Appointments = React.lazy(() => import('./features/appointments/pages/Appointments'))
const Schedule = React.lazy(() => import('./features/schedule/pages/ScheduleView'))
const Staff = React.lazy(() => import('./features/staff/pages/StaffList'))
const Clients = React.lazy(() => import('./features/clients/pages/ClientsList'))
const Analytics = React.lazy(() => import('./features/analytics/pages/AnalyticsDashboard'))
const Settings = React.lazy(() => import('./features/settings/pages/BusinessSettings'))
const Services = React.lazy(() => import('./features/services/pages/ServicesList'))
const Page403 = React.lazy(() => import('./pages/error/Page403'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', permission: 'dashboard:read', name: 'Dashboard', element: Dashboard },
  { path: '/error/403', name: 'Access Denied', element: Page403 },
  { path: '/sandbox', permission: 'sandbox:read', name: 'Sandbox', element: Sandbox },
  {
    path: '/appointments',
    permission: 'appointments:read',
    name: 'Appointments',
    element: Appointments,
  },
  { path: '/schedule', permission: 'schedule:read', name: 'Schedule', element: Schedule },
  { path: '/staff', permission: 'staff:read', name: 'Staff', element: Staff },
  { path: '/clients', permission: 'clients:read', name: 'Clients', element: Clients },
  { path: '/analytics', permission: 'analytics:read', name: 'Analytics', element: Analytics },
  { path: '/settings', permission: 'settings:read', name: 'Settings', element: Settings },
  { path: '/services', permission: 'services:read', name: 'Services', element: Services },
]

export default routes
