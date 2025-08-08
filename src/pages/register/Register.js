import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilBuilding } from '@coreui/icons'
import { registerBusiness } from '../../services/auth'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('owner@urbancuts.com')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!businessName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const { user, business, error: registerError } = await registerBusiness(businessName, email, password)

    if (registerError) {
      setError(registerError)
      setLoading(false)
    } else if (user) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your Melon Business account</p>

                  {error && (
                    <CAlert color="danger" className="mb-3">
                      {error}
                    </CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilBuilding} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Business Name"
                      autoComplete="organization"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton
                      type="submit"
                      color="success"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </CButton>
                  </div>

                  <div className="text-center mt-3">
                    <span className="text-body-secondary">Already have an account? </span>
                    <CButton
                      color="link"
                      className="p-0"
                      onClick={() => navigate('/login')}
                    >
                      Sign in here
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
