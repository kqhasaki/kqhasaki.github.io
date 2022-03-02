import React, { useEffect, useRef } from 'react'
import './index.css'

export default function TableOfContent({ headers }) {
  const ref = useRef()

  function handleClickHeader(event, header) {
    ref.current.scrollTo({
      behavior: 'smooth',
      top: event.target.offsetTop - 200,
    })
    header.target.scrollIntoView()
  }

  return (
    headers?.length && (
      <div className="table-of-content" ref={ref}>
        {headers.map((header, idx) => (
          <p
            className={`header-level-${header.level}`}
            key={idx}
            onClick={event => {
              handleClickHeader(event, header)
            }}
          >
            {header.label}
          </p>
        ))}
      </div>
    )
  )
}
