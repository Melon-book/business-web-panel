import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { DocsLink } from './index'

const DocsExample = (props) => {
  const { children, href, ...rest } = props

  return (
    <div className="example">
      <CCard {...rest}>
        <CCardHeader>
          <DocsLink href={href} />
        </CCardHeader>
        <CCardBody>{children}</CCardBody>
      </CCard>
    </div>
  )
}

export default DocsExample