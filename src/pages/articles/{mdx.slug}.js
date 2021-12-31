import React, { useEffect } from 'react'
import BaseLayout from '../../components/base-layout'
import { graphql, useStaticQuery } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { motion } from 'framer-motion'
import { FieldTimeOutlined, ReadOutlined } from '@ant-design/icons'
import '../../components/base-layout/index.css'

export default function ArticleView(props) {
  const article = useStaticQuery(graphql`
    query ($id: String) {
      mdx(id: { eq: $id }) {
        frontmatter {
          cover
          date(formatString: "YYYY-MM-DD")
          title
        }
        body
        timeToRead
        wordCount {
          words
        }
      }
    }
  `).mdx

  useEffect(() => {
    document.title = article.frontmatter.title
  }, [article])

  return (
    <BaseLayout>
      <motion.div
        className="article-body"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="article-title">{article.frontmatter.title}</h1>
        <p className="article-meta">
          <span>
            <FieldTimeOutlined /> {article.frontmatter.date} | <ReadOutlined />{' '}
            {article.timeToRead}min
          </span>
        </p>
        <img
          className="article-cover"
          src={article.frontmatter.cover}
          alt={article.frontmatter.cover}
        />
        <MDXRenderer>{article.body}</MDXRenderer>
      </motion.div>
    </BaseLayout>
  )
}
