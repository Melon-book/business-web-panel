import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))

// Error pages
const Page403 = React.lazy(() => import('./pages/error/Page403/Page403'))

// Feature pages
const Appointments = React.lazy(() => import('./features/appointments/pages/Appointments'))
const Schedule = React.lazy(() => import('./features/schedule/pages/ScheduleView'))
const Staff = React.lazy(() => import('./features/staff/pages/StaffList'))
const Clients = React.lazy(() => import('./features/clients/pages/ClientsList'))
const Services = React.lazy(() => import('./features/services/pages/ServicesList'))
const Analytics = React.lazy(() => import('./features/analytics/pages/AnalyticsDashboard'))
const Settings = React.lazy(() => import('./features/settings/pages/BusinessSettings'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', permission: 'dashboard:read', name: 'Dashboard', element: Dashboard },
  { path: '/error/403', name: 'Access Denied', element: Page403 },
  {
    path: '/appointments',
    permission: 'appointments:read',
    name: 'Appointments',
    element: Appointments,
  },
  {
    path: '/appointments/new',
    permission: 'appointments:create',
    name: 'New Appointment',
    element: React.lazy(() => import('./features/appointments/pages/AppointmentForm')),
  },
  {
    path: '/appointments/:id',
    permission: 'appointments:read',
    name: 'Appointment Details',
    element: React.lazy(() => import('./features/appointments/pages/AppointmentDetails')),
  },
  {
    path: '/appointments/:id/edit',
    permission: 'appointments:update',
    name: 'Edit Appointment',
    element: React.lazy(() => import('./features/appointments/pages/AppointmentForm')),
  },
  { path: '/schedule', permission: 'schedule:read', name: 'Schedule', element: Schedule },
  { path: '/staff', permission: 'staff:read', name: 'Staff', element: Staff },
  // {
  //   path: '/staff/new',
  //   permission: 'staff:create',
  //   name: 'Add Staff Member',
  //   element: React.lazy(() => import('./features/staff/pages/StaffForm')),
  // },
  // {
  //   path: '/staff/:id',
  //   permission: 'staff:read',
  //   name: 'Staff Details',
  //   element: React.lazy(() => import('./features/staff/pages/StaffDetails')),
  // },
  // {
  //   path: '/staff/:id/edit',
  //   permission: 'staff:update',
  //   name: 'Edit Staff Member',
  //   element: React.lazy(() => import('./features/staff/pages/StaffForm')),
  // },
  { path: '/clients', permission: 'clients:read', name: 'Clients', element: Clients },
  // {
  //   path: '/clients/:id',
  //   permission: 'clients:read',
  //   name: 'Client Details',
  //   element: React.lazy(() => import('./features/clients/pages/ClientDetails')),
  // },
  { path: '/services', permission: 'services:read', name: 'Services', element: Services },
  // {
  //   path: '/services/new',
  //   permission: 'services:create',
  //   name: 'Add Service',
  //   element: React.lazy(() => import('./features/services/pages/ServiceForm')),
  // },
  // {
  //   path: '/services/:id/edit',
  //   permission: 'services:update',
  //   name: 'Edit Service',
  //   element: React.lazy(() => import('./features/services/pages/ServiceForm')),
  // },
  { path: '/analytics', permission: 'analytics:read', name: 'Analytics', element: Analytics },
  { path: '/settings', permission: 'settings:read', name: 'Settings', element: Settings },
  // {
  //   path: '/settings/business',
  //   permission: 'settings:update',
  //   name: 'Business Settings',
  //   element: React.lazy(() => import('./features/settings/pages/BusinessSettings')),
  // },
  // {
  //   path: '/settings/employees',
  //   permission: 'settings:update',
  //   name: 'Employee Settings',
  //   element: React.lazy(() => import('./features/settings/pages/EmployeeSettings')),
  // },
  // {
  //   path: '/settings/integrations',
  //   permission: 'settings:update',
  //   name: 'Integrations',
  //   element: React.lazy(() => import('./features/settings/pages/Integrations')),
  // },
]

export default routes
