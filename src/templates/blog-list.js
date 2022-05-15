import React from 'react'
import BaseLayout from '../components/base-layout'
import { graphql, navigate } from 'gatsby'
import { PostCard, Paginator } from '../components'
import { motion } from 'framer-motion'

export const query = graphql`
  query blogListQuery($skip: Int!, $limit: Int!, $regex: String!) {
    allMdx(
      skip: $skip
      limit: $limit
      filter: { slug: { regex: $regex } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
`

export default function ArticlesView({ data, pageContext }) {
  const articles = data.allMdx.nodes

  function navigateToPage(pageNum) {
    const { postType } = pageContext
    const baseURL = postType === 'TECH' ? '/' : '/non-tech/'
    const url = pageNum === 1 ? baseURL : `${baseURL}list-${pageNum}`

    navigate(url)
  }

  return (
    <BaseLayout>
      {articles.map(article => (
        <motion.div
          key={article.id}
          initial={{ x: -60, opacity: 0.8 }}
          animate={{
            x: 0,
            opacity: 1,
          }}
        >
          <PostCard article={article} />
        </motion.div>
      ))}

      <Paginator
        totalPage={pageContext.numPages}
        currentPage={pageContext.currentPage}
        navigateToPage={navigateToPage}
      />
    </BaseLayout>
  )
}
