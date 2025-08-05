import React from 'react'

const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))
const Login = React.lazy(() => import('./pages/login/Login'))
const Register = React.lazy(() => import('./pages/register/Register'))
const Page404 = React.lazy(() => import('./pages/error/Page404'))
const Page500 = React.lazy(() => import('./pages/error/Page500'))

// Feature pages
const Appointments = React.lazy(() => import('./features/appointments/pages/AppointmentsList'))
const Schedule = React.lazy(() => import('./features/schedule/pages/ScheduleView'))
const Staff = React.lazy(() => import('./features/staff/pages/StaffList'))
const Clients = React.lazy(() => import('./features/clients/pages/ClientsList'))
const Services = React.lazy(() => import('./features/services/pages/ServicesList'))
const Analytics = React.lazy(() => import('./features/analytics/pages/AnalyticsDashboard'))
const Settings = React.lazy(() => import('./features/settings/pages/BusinessSettings'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/appointments', name: 'Appointments', component: Appointments },
  { path: '/schedule', name: 'Schedule', component: Schedule },
  { path: '/staff', name: 'Staff', component: Staff },
  { path: '/clients', name: 'Clients', component: Clients },
  { path: '/services', name: 'Services', component: Services },
  { path: '/analytics', name: 'Analytics', component: Analytics },
  { path: '/settings', name: 'Settings', component: Settings },
]

export default routes
