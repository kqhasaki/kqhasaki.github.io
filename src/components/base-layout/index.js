import React, { useEffect, useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { ReadOutlined, HomeOutlined } from '@ant-design/icons'
import { Modal } from '../../components'
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
  const [language, setLanguage] = useState('Chinese')
  const [themeClass, setThemeClass] = useState()

  function changeTheme() {
    setThemeClass(theme => {
      if (theme === 'light') return 'dark'
      else return 'light'
    })
  }

  useEffect(() => {
    if (!themeClass) return
    const body = document.querySelector('body')
    localStorage.setItem('theme', themeClass)
    body.className = themeClass
  }, [themeClass])

  useEffect(() => {
    const body = document.querySelector('body')
    const theme = localStorage.getItem('theme')
    if (!theme) {
      localStorage.setItem('theme', 'light')
      setThemeClass('light')
      return
    }
    body.className = theme
    setThemeClass(theme)
  }, [])

  return (
    <languageContext.Provider value={language}>
      <div className={clsx('base-wrapper')}>
        <title>
          {pageTitle && `${pageTitle} |`}
          {title}
        </title>
        <header>
          <Link to="/" className="nav-link" activeClassName="link-active">
            <motion.div whileHover={{ scale: 1.1 }}>
              <HomeOutlined />
            </motion.div>
          </Link>
          <Link
            to="/articles"
            className="nav-link"
            activeClassName="link-active"
          >
            <motion.div whileHover={{ scale: 1.1 }}>
              <ReadOutlined />
            </motion.div>
          </Link>
          <motion.div
            className="nav-link"
            whileHover={{ scale: 1.1 }}
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
          {themeClass === 'light' ? (
            <img src={moonSvg} />
          ) : (
            <img src={sunSvg} />
          )}
        </div>
        <Footer />
      </div>
    </languageContext.Provider>
  )
}
