module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: `Salon 94 Design`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`,
        name: 'data',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [],
      },
    },
    `gatsby-transformer-yaml-netlify`,
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-112529591-1',
      }
    }
  ],
}
