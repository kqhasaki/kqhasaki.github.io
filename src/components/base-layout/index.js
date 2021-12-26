import React, { useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { ReadOutlined, HomeOutlined } from '@ant-design/icons'
import { Modal } from '../../components'
import AvatraCard from '../avatar-card'
import './index.css'
import avatar from '../../images/avatar.png'

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

  return (
    <div className="base-wrapper">
      <title>
        {pageTitle && `${pageTitle} |`}
        {title}
      </title>
      <header>
        <Link to="/" className="nav-link" activeClassName="link-active">
          <HomeOutlined />
        </Link>
        <Link to="/articles" className="nav-link" activeClassName="link-active">
          <ReadOutlined />
        </Link>
        <div
          className="nav-link"
          onClick={() => {
            setProfileModalVisible(true)
          }}
        >
          <img alt="avatar" src={avatar} />
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
    </div>
  )
}
