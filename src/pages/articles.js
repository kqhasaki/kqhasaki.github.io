import React from 'react'
import BaseLayout from '../components/base-layout'
import { graphql, useStaticQuery } from 'gatsby'
import { PostCard } from '../components'
import { motion } from 'framer-motion'
import moment from 'moment'

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
  `).allMdx.nodes.sort((a, b) => {
    const date1 = moment(a.frontmatter.date)
    const date2 = moment(b.frontmatter.date)
    return date2.unix() - date1.unix()
  })

  return (
    <BaseLayout>
      {articles.map(article => (
        <motion.div
          key={article.id}
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
