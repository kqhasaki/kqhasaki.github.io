import React from 'react'
import BaseLayout from '../../components/base-layout'
import { graphql, useStaticQuery } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'

export default function ArticleView(props) {
  const article = useStaticQuery(graphql`
    query ($id: String) {
      mdx(id: { eq: $id }) {
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
        }
        body
      }
    }
  `).mdx

  console.log(article)
  return (
    <BaseLayout>
      <MDXRenderer>{article.body}</MDXRenderer>
    </BaseLayout>
  )
}
