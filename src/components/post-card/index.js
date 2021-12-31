import React from 'react'
import { motion } from 'framer-motion'
import { navigate } from 'gatsby'
import { FieldTimeOutlined } from '@ant-design/icons'
import './index.css'

export default function PostCard({ article }) {
  return (
    <motion.div
      className="post-card"
      whileTap={{ boxShadow: '0 0 2rem rgba(24, 159, 255, 0.5)' }}
      whileHover={{ boxShadow: '0 0 2rem rgba(0, 0, 0, 0.1)' }}
      onClick={() => {
        navigate(article.slug)
      }}
    >
      <div className="img-line">
        <img
          src={article.frontmatter.cover}
          alt="cover-img"
          className="post-card-img"
        />
      </div>
      <h2>{article.frontmatter.title}</h2>
      <p className="post-card-meta">
        <FieldTimeOutlined />
        <span> {article.frontmatter.date}</span>
        <span>
          {' '}
          | {article.wordCount.words}words {article.timeToRead}min
        </span>
      </p>
      <p>{article.excerpt}</p>
    </motion.div>
  )
}