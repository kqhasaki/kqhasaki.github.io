import React, { useEffect, useRef, useState } from 'react'
import { YoutubeOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import './index.css'

export default function TableOfContent({ headers }) {
  const ref = useRef()
  const [topHeaderKey, setTopHeaderKey] = useState(0)

  function handleClickHeader(event, header) {
    ref.current.scrollTo({
      behavior: 'smooth',
      top: event.target.offsetTop - 200,
    })
    header.target.scrollIntoView()
  }

  useEffect(() => {
    const scrollHandler = () => {
      let idx = 0
      for (const header of headers) {
        const top = header.target.getBoundingClientRect().top
        if (top > 0) break
        idx++
      }
      idx = Math.min(headers.length - 1, idx)
      setTopHeaderKey(idx)
      const topHeader = document.getElementById(`header-number-${idx}`)
      if (!topHeader) return
      ref.current.scrollTo({
        behavior: 'smooth',
        top: topHeader.offsetTop - 200,
      })
    }

    const scrollHandlerDebounced = debounce(scrollHandler, 150)

    document.addEventListener('scroll', scrollHandlerDebounced)

    return () => document.removeEventListener('scroll', scrollHandlerDebounced)
  }, [])

  return (
    <div className="table-of-content" ref={ref}>
      {headers.map((header, idx) => (
        <p
          className={`header-level-${header.level} ${
            topHeaderKey === idx ? 'topHeader' : ''
          }`}
          id={`header-number-${idx}`}
          key={idx}
          onClick={event => {
            handleClickHeader(event, header)
          }}
        >
          {header.name === 'media' && <YoutubeOutlined />} {header.label}
        </p>
      ))}
    </div>
  )
}
