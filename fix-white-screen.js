const fs = require('fs');
const path = require('path');

const filesToCreate = {
  'src/index.js': `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)`,

  'src/App.jsx': `import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './state/store'
import DefaultLayout from './layouts/DefaultLayout'

const Loading = () => (
  <div className="pt-3 text-center">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

const Login = React.lazy(() => import('./pages/login/Login'))
const Register = React.lazy(() => import('./pages/register/Register'))
const Page404 = React.lazy(() => import('./pages/error/Page404'))
const Page403 = React.lazy(() => import('./pages/error/Page403'))

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/error/404" element={<Page404 />} />
            <Route path="/error/403" element={<Page403 />} />
            <Route path="/*" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  )
}

export default App`,

  'src/state/store.js': `import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const store = configureStore({
  reducer: {
    ui: uiReducer
  }
})

export default store`,

  'src/layouts/DefaultLayout.jsx': `import React, { Suspense } from 'react'
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

export default DefaultLayout`,

  'src/components/AppSidebar.jsx': `import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { sygnet } from '@coreui/icons'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui?.sidebarUnfoldable || false)
  const sidebarShow = useSelector((state) => state.ui?.sidebarShow || true)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', payload: { sidebarShow: visible } })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <div className="sidebar-brand-full">
          <strong>Melon</strong>
        </div>
        <CIcon className="sidebar-brand-minimized" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <AppSidebarNav items={navigation} />
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', payload: { sidebarUnfoldable: !unfoldable } })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)`,

  'src/components/AppHeader.jsx': `import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './AppBreadcrumb'
import { AppHeaderDropdown } from './AppHeaderDropdown'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.ui?.sidebarShow || true)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', payload: { sidebarShow: !sidebarShow } })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          Melon
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <AppBreadcrumb />
        </CHeaderNav>
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
    </CHeader>
  )
}

export default AppHeader`,

  'src/components/AppFooter.jsx': `import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">&copy; 2024 Melon Business Dashboard.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <span>Melon Platform</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)`,

  'src/components/AppBreadcrumb.jsx': `import React from 'react'
import { useLocation } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const routes = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/appointments', name: 'Appointments' },
  { path: '/schedule', name: 'Schedule' },
  { path: '/staff', name: 'Staff' },
  { path: '/clients', name: 'Clients' },
  { path: '/services', name: 'Services' },
  { path: '/analytics', name: 'Analytics' },
  { path: '/settings', name: 'Settings' }
]

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = \`\${prev}/\${curr}\`
      const routeName = getRouteName(currentPathname)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="ms-2">
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)`,

  'src/components/AppHeaderDropdown.jsx': `import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar
          shape="rounded-1"
          size="md"
          status="success"
        >
          U
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 pr-5 w-auto">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown`,

  'src/components/AppSidebarNav.jsx': `import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CBadge } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}`,

  'package.json': `{
  "name": "melon-business-web-panel",
  "version": "1.0.0",
  "private": true,
  "homepage": ".",
  "dependencies": {
    "@coreui/coreui": "^5.4.0",
    "@coreui/icons": "^3.0.1",
    "@coreui/icons-react": "^2.3.0",
    "@coreui/react": "^5.4.0",
    "@reduxjs/toolkit": "^2.2.3",
    "bootstrap": "^5.3.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.23.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
}

const createFiles = () => {
  Object.entries(filesToCreate).forEach(([filePath, content]) => {
    const fullPath = path.join(process.cwd(), filePath)
    const dir = path.dirname(fullPath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(fullPath, content)
    console.log(`Created/Updated: ${filePath}`)
  })
}

const fixWhiteScreen = () => {
  console.log('Fixing white screen issues...')
  createFiles()
  console.log('White screen fix completed!')
  console.log('Run: npm install && npm start')
}

fixWhiteScreen()
