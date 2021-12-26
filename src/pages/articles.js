import React from 'react'
import BaseLayout from '../components/base-layout'
import { graphql, useStaticQuery } from 'gatsby'

export default function ArticlesView() {
  const articles = useStaticQuery(graphql`
    query {
      allMdx {
        totalCount
        nodes {
          excerpt
          id
          slug
          frontmatter {
            title
            date
          }
          timeToRead
          wordCount {
            paragraphs
            sentences
            words
          }
        }
      }
    }
  `).allMdx.nodes

  console.log(articles)

  return <BaseLayout></BaseLayout>
}
