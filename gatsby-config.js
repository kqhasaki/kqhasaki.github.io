module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    siteUrl: 'https://www.yourdomain.tld',
    title: 'Louis K - Software Engineer',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-highlight-code`,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'articles', path: `${__dirname}/articles` },
    },
  ],
}
