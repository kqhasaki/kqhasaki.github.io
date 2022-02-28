import React from 'react'
import {
  WechatOutlined,
  BookFilled,
  MailFilled,
  QqOutlined,
} from '@ant-design/icons'
import resume from '../../static/resume/resume.pdf'
import './index.css'

const outerLinks = [
  { url: 'https://reactjs.org/', label: 'React' },
  { url: 'https://developer.mozilla.org/zh-CN/', label: 'MDN' },
  { url: 'https://leafletjs.com/reference.html', label: 'Leaflet' },
  { url: 'https://ant.design/index-cn', label: 'Ant Design' },
  { url: 'https://webpack.docschina.org/concepts/', label: 'webpack' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrapper">
        <p style={{ fontSize: '1.3rem' }}>
          <span>
            <WechatOutlined />
          </span>
          <span>
            <QqOutlined />
          </span>
          <span>
            <a href={resume} download="简历.pdf">
              <BookFilled />
            </a>
          </span>
          <span>
            <a href="mailto:k1664032884@gmail.com">
              <MailFilled />
            </a>
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
                <a href={url} rel="noreferrer">
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
