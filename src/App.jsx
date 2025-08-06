import React, { Suspense } from 'react'
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

export default App