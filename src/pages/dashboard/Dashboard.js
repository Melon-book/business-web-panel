import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { logout } from '../../services/auth'

const Dashboard = () => {
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Dashboard</strong>
            </CCardHeader>
            <CCardBody>
              Welcome to Melon Business Dashboard<br />


              <CButton onClick={logout} color="primary">
                logout
              </CButton><br />

              <Link to="/dashboard">Dashboard</Link><br />
              <Link to="/appointments">appointments</Link><br />
              <Link to="/sandbox">sandbox</Link><br />

              <Link to="/schedule">schedule</Link><br />
              <Link to="/staff">staff</Link><br />
              <Link to="/clients">clients</Link><br />
              <Link to="/services">services</Link><br />
              <Link to="/analytics">analytics</Link><br />
              <Link to="/settings">settings</Link><br />

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
