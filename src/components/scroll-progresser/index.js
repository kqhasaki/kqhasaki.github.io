import React, { useEffect, useState } from 'react'
import './index.css'

export default function ScrollProgresser() {
  const [progress, setProgress] = useState(0)

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handler = window.addEventListener('scroll', () => {
      const totalScroll =
        document.body.scrollHeight - document.documentElement.clientHeight
      const currScroll = document.documentElement.scrollTop

      const _progress = Math.floor(100 * (currScroll / totalScroll))

      setProgress(Math.min(100, Math.max(0, _progress)))
    })

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  return (
    <div className="progresser" onClick={scrollToTop}>
      {progress}
    </div>
  )
}
