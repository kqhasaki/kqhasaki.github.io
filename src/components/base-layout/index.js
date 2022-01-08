import React, { useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { ReadOutlined, HomeOutlined } from '@ant-design/icons'
import { Modal } from '../../components'
import AvatraCard from '../avatar-card'
import './index.css'
import avatar from '../../images/avatar.png'
import { motion } from 'framer-motion'
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

  return (
    <languageContext.Provider value={language}>
      <div className="base-wrapper">
        <title>
          {pageTitle && `${pageTitle} |`}
          {title}
        </title>
        <header>
          <Link to="/" className="nav-link" activeClassName="link-active">
            <motion.div whileHover={{ scale: 1.2 }}>
              <HomeOutlined />
            </motion.div>
          </Link>
          <Link
            to="/articles"
            className="nav-link"
            activeClassName="link-active"
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <ReadOutlined />
            </motion.div>
          </Link>
          <motion.div
            className="nav-link"
            whileHover={{ scale: 1.2 }}
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
      </div>
    </languageContext.Provider>
  )
}
