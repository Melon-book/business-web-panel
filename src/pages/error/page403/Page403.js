import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Page403 = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">403</h1>
              <h4 className="pt-3">Access Denied</h4>
              <p className="text-body-secondary float-start">
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

export default Page403
