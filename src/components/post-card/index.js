import React from 'react'
import { motion } from 'framer-motion'
import { navigate } from 'gatsby'
import { FieldTimeOutlined, TagOutlined } from '@ant-design/icons'
import './index.css'
import { GROUP_TITLES } from '../article-navigator'

function getArticleGroupTitle(slug) {
  const relativePath = slug.split('/')[0]
  return GROUP_TITLES[relativePath]
}

export default function PostCard({ article }) {
  return (
    <motion.div
      className="post-card"
      onClick={() => {
        navigate('/articles/' + article.slug)
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
        <span style={{ fontWeight: 'normal' }}>
          <TagOutlined style={{ fontSize: 12 }} />{' '}
          {getArticleGroupTitle(article.slug)}{' '}
        </span>
      </p>
      <p className="post-card-meta" style={{ marginTop: 4 }}>
        <span>
          <FieldTimeOutlined /> {article.frontmatter.date}
        </span>
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
