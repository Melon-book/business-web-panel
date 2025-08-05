const fs = require('fs');
const path = require('path');

const filesToCreate = {
  'src/routes/index.js': `import { lazy } from 'react'

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
]`,

  'src/App.jsx': `import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './state/store'
import { routes, publicRoutes } from './routes'
import DefaultLayout from './layouts/DefaultLayout'
import './scss/style.scss'

const Loading = () => (
  <div className="pt-3 text-center">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

const ProtectedRoute = ({ children, permission }) => {
  return children
}

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {publicRoutes.map(({ path, element: Element, title }) => (
              <Route
                key={path}
                path={path}
                element={<Element />}
              />
            ))}

            <Route
              path="/*"
              element={
                <DefaultLayout>
                  <Routes>
                    {routes.map(({ path, element: Element, permission, title }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <ProtectedRoute permission={permission}>
                            <Element />
                          </ProtectedRoute>
                        }
                      />
                    ))}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/error/404" replace />} />
                  </Routes>
                </DefaultLayout>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  )
}

export default App`,

  'src/layouts/DefaultLayout.jsx': `import React from 'react'
import { CContainer } from '@coreui/react'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <CContainer lg>
            {children}
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout`,

  'src/pages/error/Page403.jsx': `import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Page403 = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">403</h1>
              <h4 className="pt-3">Access Forbidden</h4>
              <p className="text-medium-emphasis float-start">
                You don't have permission to access this resource.
              </p>
            </div>
            <CButton
              color="info"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page403`,

  'src/state/store.js': `import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false
}

const uiSlice = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const store = configureStore({
  reducer: uiSlice
})

export default store`,

  'src/features/appointments/pages/AppointmentsList.jsx': `import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const AppointmentsList = () => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Appointments</strong>
      </CCardHeader>
      <CCardBody>
        Appointments list will be displayed here.
      </CCardBody>
    </CCard>
  )
}

export default AppointmentsList`,

  'src/features/schedule/pages/ScheduleView.jsx': `import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const ScheduleView = () => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Schedule</strong>
      </CCardHeader>
      <CCardBody>
        Schedule view will be displayed here.
      </CCardBody>
    </CCard>
  )
}

export default ScheduleView`,

  'src/features/staff/pages/StaffList.jsx': `import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const StaffList = () => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Staff</strong>
      </CCardHeader>
      <CCardBody>
        Staff list will be displayed here.
      </CCardBody>
    </CCard>
  )
}

export default StaffList`,

  'src/features/clients/pages/ClientsList.jsx': `import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const ClientsList = () => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Clients</strong>
      </CCardHeader>
      <CCardBody>
        Clients list will be displayed here.
      </CCardBody>
    </CCard>
  )
}

export default ClientsList`,

  'src/features/services/pages/ServicesList.jsx': `import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const ServicesList = () => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Services</strong>
      </CCardHeader>
      <CCardBody>
        Services list will be displayed here.
      </CCardBody>
    </CCard>
  )
}

export default ServicesList`,

  'src/features/analytics/pages/AnalyticsDashboard.jsx': `import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const AnalyticsDashboard = () => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Analytics</strong>
      </CCardHeader>
      <CCardBody>
        Analytics dashboard will be displayed here.
      </CCardBody>
    </CCard>
  )
}

export default AnalyticsDashboard`,

  'src/features/settings/pages/BusinessSettings.jsx': `import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const BusinessSettings = () => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Business Settings</strong>
      </CCardHeader>
      <CCardBody>
        Business settings will be displayed here.
      </CCardBody>
    </CCard>
  )
}

export default BusinessSettings`
};

const updateFolderStructure = () => {
  const oldPath = path.join(process.cwd(), 'src/styles');
  const newPath = path.join(process.cwd(), 'src/scss');

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('Renamed styles folder to scss');
  }
};

const createFiles = () => {
  Object.entries(filesToCreate).forEach(([filePath, content]) => {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    console.log(`Created: ${filePath}`);
  });
};

const setupRouting = () => {
  console.log('Setting up routing...');
  updateFolderStructure();
  createFiles();
  console.log('Routing setup completed!');
};

setupRouting();
