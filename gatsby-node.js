const path = require(`path`)
// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`)
}
// Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMdx(sort: { fields: [slug], order: ASC }) {
        edges {
          previous {
            slug
            frontmatter {
              title
            }
          }
          next {
            slug
            frontmatter {
              title
            }
          }
          node {
            id
            frontmatter {
              cover
              date(formatString: "YYYY-MM-DD")
              title
            }
            body
            slug
            wordCount {
              sentences
            }
          }
        }
      }
    }
  `)

  const allPosts = result.data.allMdx.edges

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
  allPosts.forEach(edge => {
    createPage({
      path: `/articles/${edge.node.slug}`,
      component: blogPostTemplate,
      context: {
        title: edge.node.title,
        data: edge,
        next: edge.next,
        previous: edge.previous,
      },
    })
  })

  const techPostsResult = await graphql(`
    query {
      allMdx(
        filter: { slug: { regex: "/^(?!non-tech)/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `)

  const postsPerPage = 6
  const techPosts = techPostsResult.data.allMdx.edges
  const techPagesNum = Math.ceil(techPosts.length / postsPerPage)
  Array.from({ length: techPagesNum }).forEach((_, idx) => {
    createPage({
      path: idx === 0 ? '/' : `/list-${idx + 1}`,
      component: path.resolve('src/templates/blog-list.js'),
      context: {
        limit: postsPerPage,
        skip: idx * postsPerPage,
        numPages: techPagesNum,
        currentPage: idx + 1,
        postType: 'TECH',
        regex: '/^(?!non-tech)/',
      },
    })
  })

  const nonTechPostsResult = await graphql(`
    query {
      allMdx(
        filter: { slug: { regex: "/^(non-tech)/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `)

  const nonTechPosts = nonTechPostsResult.data.allMdx.edges
  const nonTechPagesNum = Math.ceil(nonTechPosts.length / postsPerPage)
  Array.from({ length: nonTechPagesNum }).forEach((_, idx) => {
    createPage({
      path: idx === 0 ? '/non-tech/' : `/non-tech/list-${idx + 1}`,
      component: path.resolve('src/templates/blog-list.js'),
      context: {
        limit: postsPerPage,
        skip: idx * postsPerPage,
        numPages: nonTechPagesNum,
        currentPage: idx + 1,
        postType: 'NON_TECH',
        regex: '/^(non-tech)/',
      },
    })
  })
}
