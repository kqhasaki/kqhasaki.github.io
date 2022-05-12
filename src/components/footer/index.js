import React, { useEffect, useState } from 'react'
import resume from '../../static/resume/resume.pdf'
import resumeEn from '../../static/resume/resume-en.pdf'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeixin, faQq, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faFile,
  faFileSignature,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import './index.css'

let globalTheme = null

export default function Footer() {
  const [theme, setTheme] = useState(globalTheme)

  function changeTheme(newTheme) {
    document.querySelector('body').className = `${newTheme}`
    setTheme(newTheme)
    globalTheme = newTheme
  }

  useEffect(() => {
    if (!globalTheme) {
      const themeMedia = window.matchMedia('(prefers-color-scheme: light)')
      const initTheme = themeMedia.matches ? 'light' : 'dark'
      setTheme(initTheme)
      globalTheme = initTheme
    }
  }, [])

  return (
    <footer className="footer">
      <div className="wrapper">
        <div>
          <h3>Thanks for reading!</h3>
          <p>CopyRight &copy; 2022 Louis K - Present</p>
        </div>
        <div>
          <p style={{ fontSize: '1.3rem' }}>
            <span>
              <FontAwesomeIcon icon={faWeixin} />
            </span>
            <span>
              <FontAwesomeIcon icon={faQq} />
            </span>
            <span>
              <a href="mailto:k1664032884@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </span>
            <span>
              <a
                href="https://github.com/kqhasaki"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </span>
            {/* <span>
              <a href={resume} download="resume.pdf" title="简历下载">
                <FontAwesomeIcon icon={faFile} />
              </a>
            </span>
            <span>
              <a href={resumeEn} download="resume-en.pdf" title="resume">
                <FontAwesomeIcon icon={faFileSignature} />
              </a>
            </span> */}
          </p>
        </div>
      </div>
    </footer>
  )
}
