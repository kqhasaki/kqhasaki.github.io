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
            options: {
              theme: 'one-dark',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'articles', path: `${__dirname}/articles` },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Louis K',
        short_name: 'Louis K',
        start_url: '/',
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: 'standalone',
        icon: 'src/images/avatar.png', // This path is relative to the root of the site.
        // An optional attribute which provides support for CORS check.
        // If you do not provide a crossOrigin option, it will skip CORS for manifest.
        // Any invalid keyword or empty string defaults to `anonymous`
        crossOrigin: `use-credentials`,
      },
    },
  ],
}
