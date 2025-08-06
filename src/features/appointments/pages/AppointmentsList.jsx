import React from 'react'
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

export default AppointmentsList