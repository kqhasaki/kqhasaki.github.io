import React, { useEffect, useState } from 'react'
import BaseLayout from '../../components/base-layout'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FieldTimeOutlined, ReadOutlined } from '@ant-design/icons'
import ScrollProgresser from '../../components/scroll-progresser'
import TableOfContent from '../../components/table-of-content'
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
  const [headers, setHeaders] = useState([])

  useEffect(() => {
    document.title = article.frontmatter.title

    const links = document.querySelectorAll('.article-body a')
    links?.forEach(link => (link.target = '_blank'))

    const allHeaders = document.querySelectorAll(
      '.article-body h1, .article-body h2, .article-body h3'
    )
    const _headers = Array.from(allHeaders).map((header, idx) => {
      header.setAttribute('name', idx)
      const { localName, textContent } = header
      return {
        level: localName,
        name: `header-${idx}`,
        label: textContent,
        target: header,
      }
    })
    setHeaders(_headers)

    const headNavigate = event => {
      const { target } = event
      if (target.matches('h1, h2, h3')) {
        target.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
    document.addEventListener('click', headNavigate)

    return () => {
      document.removeEventListener('click', headNavigate)
    }
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
      <TableOfContent headers={headers} />
    </BaseLayout>
  )
}
