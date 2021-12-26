module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    siteUrl: 'https://www.yourdomain.tld',
    title: 'Louis K - Software Engineer',
  },
  plugins: [
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'articles', path: `${__dirname}/articles` },
    },
  ],
}
