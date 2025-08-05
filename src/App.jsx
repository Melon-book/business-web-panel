import React, { Suspense } from 'react'
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

export default App