import React from 'react'
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

export default ClientsList