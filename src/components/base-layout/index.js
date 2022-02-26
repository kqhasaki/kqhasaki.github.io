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
import moonSvg from '../../images/moon.svg'
import sunSvg from '../../images/sun.svg'

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
  const [themeClass, setThemeClass] = useState()

  function changeTheme() {
    const body = document.querySelector('body')
    const newtheme = themeClass === 'light' ? 'dark' : 'light'
    setThemeClass(newtheme)
    body.className = newtheme
    localStorage.setItem('theme', newtheme)
  }

  useEffect(() => {
    const body = document.querySelector('body')
    let theme = localStorage.getItem('theme')
    if (!theme) {
      const themeMedia = window.matchMedia('(prefers-color-scheme: light)')
      theme = themeMedia.matches ? 'light' : 'dark'
    }
    body.className = theme
    setThemeClass(theme)

    document.addEventListener('copy', e => {
      const text = e.target.textContent
      e.clipboardData.setData(
        'text/plain',
        `${text}\n-- 粘帖自LouisK的博客，联系：邮箱k1664032884@gmail.com，微信kuaiqianghasai --`
      )
      message.success('复制成功')
      e.preventDefault()
    })

    document.addEventListener('dblclick', e => {
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
    })
  }, [])

  return (
    <div className={clsx('base-wrapper')}>
      <title>
        {pageTitle && `${pageTitle} |`}
        {title}
      </title>
      <header>
        <Link to="/" className="nav-link" activeClassName="link-active">
          <motion.div whileHover={{ scale: 1.05 }}>
            <HomeOutlined />
          </motion.div>
        </Link>
        <Link to="/articles" className="nav-link" activeClassName="link-active">
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
      <div className="theme-changer" onClick={changeTheme}>
        {themeClass === 'light' ? <img src={moonSvg} /> : <img src={sunSvg} />}
      </div>
      <Footer />
    </div>
  )
}
