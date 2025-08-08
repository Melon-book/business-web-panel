import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'

const AppointmentDetails = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Appointment Details</strong>
          </CCardHeader>
          <CCardBody>
            <p>Appointment details page - coming soon</p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AppointmentDetails
