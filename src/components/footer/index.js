import React, { useEffect, useState } from 'react'
import resume from '../../static/resume/resume.pdf'
import resumeEn from '../../static/resume/resume-en.pdf'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeixin, faQq, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faMoon,
  faSun,
  faFile,
  faFileSignature,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import './index.css'

const outerLinks = [
  { url: 'https://reactjs.org/', label: 'React' },
  { url: 'https://developer.mozilla.org/zh-CN/', label: 'MDN' },
  { url: 'https://leafletjs.com/reference.html', label: 'Leaflet' },
  { url: 'https://ant.design/index-cn', label: 'Ant Design' },
  { url: 'https://webpack.docschina.org/concepts/', label: 'webpack' },
]

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
          <span>
            <a href={resume} download="resume.pdf" title="简历下载">
              <FontAwesomeIcon icon={faFile} />
            </a>
          </span>
          <span>
            <a href={resumeEn} download="resume-en.pdf" title="resume">
              <FontAwesomeIcon icon={faFileSignature} />
            </a>
          </span>
          <span>
            {theme === 'dark' ? (
              <FontAwesomeIcon
                icon={faMoon}
                onClick={() => changeTheme('light')}
              />
            ) : (
              <FontAwesomeIcon
                icon={faSun}
                onClick={() => changeTheme('dark')}
              />
            )}
          </span>
        </p>
        <p>CopyRight &copy; 2022 Louis K</p>
      </div>

      <div className="wrapper" style={{ alignItems: 'flex-end' }}>
        <h3>Links</h3>
        <ul>
          {outerLinks.map(({ url, label }, idx) => (
            <li key={idx}>
              <span>
                <a href={url} rel="noopener noreferrer" target="_blank">
                  {label}
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
