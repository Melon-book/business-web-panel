import React from 'react'

const DocsLink = (props) => {
  const { name, text, href, ...rest } = props

  return (
    <div className="float-end">
      <a
        href={href || '#'}
        target="_blank"
        rel="noreferrer"
        {...rest}
      >
        {text || 'Documentation'}
      </a>
    </div>
  )
}

export default DocsLink