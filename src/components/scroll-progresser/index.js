import React, { useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'
import './index.css'

export default function ScrollProgresser() {
  const [progress, setProgress] = useState(0)
  const ref = useRef()
  const scrollTopRef = useRef(null)

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handler = throttle(() => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop
      if (scrollTopRef.current !== null) {
        if (currentScrollTop > scrollTopRef.current) {
          ref.current.classList.add('progresser-hide')
        } else {
          ref.current.classList.remove('progresser-hide')
        }
      }
      scrollTopRef.current = currentScrollTop
      const totalScroll =
        document.body.scrollHeight - document.documentElement.clientHeight
      const currScroll = document.documentElement.scrollTop

      const _progress = Math.floor(100 * (currScroll / totalScroll))

      setProgress(Math.min(100, Math.max(0, _progress)))
    }, 200)

    window.addEventListener('scroll', handler)

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  return (
    <div ref={ref} className="progresser" onClick={scrollToTop}>
      {progress}%
    </div>
  )
}
