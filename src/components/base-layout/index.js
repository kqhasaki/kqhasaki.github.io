import React, { useEffect, useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { ReadOutlined, HomeOutlined } from '@ant-design/icons'
import { Modal, message } from '../../components'
import AvatraCard from '../avatar-card'
import Footer from '../footer'
import './index.css'
import avatar from '../../images/avatar.png'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader'
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
      e.clipboardData.setData(
        'text/plain',
        `${text}\n-- 粘帖自LouisK的博客，联系：邮箱k1664032884@gmail.com，微信kuaiqianghasai --`
      )
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
        <Link to="/about" className="nav-link" activeClassName="link-active">
          <motion.div whileHover={{ scale: 1.05 }}>
            <HomeOutlined />
          </motion.div>
        </Link>
        <Link to="/" className="nav-link" activeClassName="link-active">
          <motion.div whileHover={{ scale: 1.05 }}>
            <ReadOutlined />
          </motion.div>
        </Link>
        <motion.div
          className="nav-link"
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            setProfileModalVisible(true)
          }}
        >
          <img alt="avatar" src={avatar} />
        </motion.div>
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
