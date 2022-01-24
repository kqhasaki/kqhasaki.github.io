import React from 'react'
import { motion } from 'framer-motion'
import { navigate } from 'gatsby'
import { FieldTimeOutlined } from '@ant-design/icons'
import './index.css'

export default function PostCard({ article }) {
  return (
    <motion.div
      className="post-card"
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
          | {Math.round((article.wordCount.sentences * 40) / 100) * 100}
          words {Math.round(article.wordCount.sentences / 7)}min
        </span>
      </p>
      <p>{article.excerpt}</p>
    </motion.div>
  )
}
