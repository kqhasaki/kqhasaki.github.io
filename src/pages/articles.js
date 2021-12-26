import React from 'react'
import BaseLayout from '../components/base-layout'
import { graphql, useStaticQuery } from 'gatsby'
import { PostCard } from '../components'
import { motion } from 'framer-motion'

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
            date(formatString: "YYYY-MM-DD")
            cover
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

  return (
    <BaseLayout>
      {articles.map(article => (
        <motion.div
          key={article.slug}
          initial={{ x: -100, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
          }}
        >
          <PostCard article={article} />
        </motion.div>
      ))}
    </BaseLayout>
  )
}
