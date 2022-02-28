import React, { useEffect } from 'react'
import BaseLayout from '../../components/base-layout'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FieldTimeOutlined, ReadOutlined } from '@ant-design/icons'
import ScrollProgresser from '../../components/scroll-progresser'
import '../../components/base-layout/index.css'

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        cover
        date(formatString: "YYYY-MM-DD")
        title
      }
      body
      wordCount {
        sentences
      }
    }
  }
`

export default function ArticleView({ data }) {
  const article = data.mdx

  useEffect(() => {
    document.title = article.frontmatter.title

    const links = document.querySelectorAll('.article-body a')
    links?.forEach(link => (link.target = '_blank'))
  }, [data])

  return (
    <BaseLayout>
      <ScrollProgresser />
      <div className="article-body">
        <h1 className="article-title">{article.frontmatter.title}</h1>
        <p className="article-meta">
          <span>
            <FieldTimeOutlined /> {article.frontmatter.date} | <ReadOutlined />{' '}
            {Math.round((article.wordCount.sentences * 40) / 100) * 100}
            words {Math.round(article.wordCount.sentences / 7)}min
          </span>
        </p>
        <img
          className="article-cover"
          src={article.frontmatter.cover}
          alt={article.frontmatter.cover}
        />
        <MDXRenderer>{article.body}</MDXRenderer>
      </div>
    </BaseLayout>
  )
}
