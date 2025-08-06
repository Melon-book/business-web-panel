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

              <Link to="/dashboard">Dashboard</Link><br />
              <Link to="/appointments">appointments</Link><br />
              <Link to="/sandbox">sandbox</Link><br />
              <Link to="/charts">charts</Link><br />
              <Link to="/theme/colors">colors</Link><br />

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
