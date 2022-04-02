import React, { useEffect, useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { ReadOutlined, DesktopOutlined } from '@ant-design/icons'
import { Modal, message } from '../../components'
import AvatraCard from '../avatar-card'
import Footer from '../footer'
import avatar from '../../images/avatar.png'
import clsx from 'clsx'
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader'
import './index.css'
deckDeckGoHighlightElement()

export const languageContext = React.createContext('Chinese')

export default function BaseLayout({ children, pageTitle }) {
  const { title } = useStaticQuery(graphql`
    query {
      site(siteMetadata: {}) {
        siteMetadata {
          title
        }
      }
    }
  `).site.siteMetadata
  const [profileModalVisible, setProfileModalVisible] = useState(false)

  useEffect(() => {
    const copyHandler = e => {
      const text = e.target.textContent
      e.clipboardData.setData('text/plain', text)
      message.success('复制成功')
      e.preventDefault()
    }
    document.addEventListener('copy', copyHandler)

    const dblclickHandler = e => {
      const { target } = e
      if (target.matches('deckgo-highlight-code')) {
        const text = target.textContent.trim()
        const targetNode = document.createElement('input')
        targetNode.style.height = 0
        targetNode.id = 'temp_board'
        targetNode.textContent = text
        document.body.appendChild(targetNode)
        targetNode.select()
        document.execCommand('copy')
        targetNode.remove()
      }
    }
    document.addEventListener('dblclick', dblclickHandler)

    return () => {
      document.removeEventListener('copy', copyHandler)
      document.removeEventListener('dblclick', dblclickHandler)
    }
  }, [])

  return (
    <div className={clsx('base-wrapper')}>
      <title>
        {pageTitle && `${pageTitle} |`}
        {title}
      </title>
      <header>
        <Link to="/nonTech/" className="nav-link" activeClassName="link-active">
          <ReadOutlined />
          <span className="link-label">杂谈文章</span>
        </Link>
        <Link to="/" className="nav-link" activeClassName="link-active">
          <DesktopOutlined />
          <span className="link-label">技术文章</span>
        </Link>
        <div
          className="nav-link"
          onClick={() => {
            setProfileModalVisible(true)
          }}
        >
          <img alt="avatar" src={avatar} />
          <span className="link-label">关于作者</span>
        </div>
      </header>
      <Modal
        visible={profileModalVisible}
        onClose={() => {
          setProfileModalVisible(false)
        }}
      >
        <AvatraCard />
      </Modal>

      <main>{children}</main>

      <Footer />
    </div>
  )
}
