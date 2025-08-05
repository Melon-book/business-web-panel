import React from 'react'
import { CCallout } from '@coreui/react'

const DocsCallout = (props) => {
  const { name, href, ...rest } = props

  return (
    <CCallout color="info" {...rest}>
      This component is used for documentation purposes only.
    </CCallout>
  )
}

export default DocsCallout