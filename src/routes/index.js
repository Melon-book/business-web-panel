import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Login = lazy(() => import('../pages/login/Login'))
const Register = lazy(() => import('../pages/register/Register'))
const Page404 = lazy(() => import('../pages/error/Page404'))
const Page403 = lazy(() => import('../pages/error/Page403'))
const AppointmentsList = lazy(() => import('../features/appointments/pages/AppointmentsList'))
const ScheduleView = lazy(() => import('../features/schedule/pages/ScheduleView'))
const StaffList = lazy(() => import('../features/staff/pages/StaffList'))
const ClientsList = lazy(() => import('../features/clients/pages/ClientsList'))
const ServicesList = lazy(() => import('../features/services/pages/ServicesList'))
const AnalyticsDashboard = lazy(() => import('../features/analytics/pages/AnalyticsDashboard'))
const BusinessSettings = lazy(() => import('../features/settings/pages/BusinessSettings'))

export const routes = [
  {
    path: '/dashboard',
    element: Dashboard,
    title: 'Dashboard',
    permission: 'dashboard:read'
  },
  {
    path: '/appointments',
    element: AppointmentsList,
    title: 'Appointments',
    permission: 'appointments:read'
  },
  {
    path: '/schedule',
    element: ScheduleView,
    title: 'Schedule',
    permission: 'schedule:read'
  },
  {
    path: '/staff',
    element: StaffList,
    title: 'Staff',
    permission: 'staff:read'
  },
  {
    path: '/clients',
    element: ClientsList,
    title: 'Clients',
    permission: 'clients:read'
  },
  {
    path: '/services',
    element: ServicesList,
    title: 'Services',
    permission: 'services:read'
  },
  {
    path: '/analytics',
    element: AnalyticsDashboard,
    title: 'Analytics',
    permission: 'analytics:read'
  },
  {
    path: '/settings',
    element: BusinessSettings,
    title: 'Settings',
    permission: 'settings:read'
  }
]

export const publicRoutes = [
  {
    path: '/login',
    element: Login,
    title: 'Login'
  },
  {
    path: '/register',
    element: Register,
    title: 'Register'
  },
  {
    path: '/error/404',
    element: Page404,
    title: 'Page Not Found'
  },
  {
    path: '/error/403',
    element: Page403,
    title: 'Access Forbidden'
  }
]