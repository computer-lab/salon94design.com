const path = require('path')

exports.createPages = props => {
  return Promise.all([createBlogPosts(props), createProjects(props)])
}

function createBlogPosts({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  const postTemplate = path.resolve(`src/templates/post.js`)

  return graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          html
          id
          frontmatter {
            date
            path
            title
          }
        }
      }
    }
  }`).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: postTemplate,
        context: {}, // additional data can be passed via context
      })
    })
  })
}

function createProjects({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  const projectTemplate = path.resolve(`src/templates/project.js`)

  return graphql(`{
    allProjectsYaml(
      sort: { order: DESC, fields: [when] }
    ) {
      edges {
        node {
          slug
          when
        }
      }
    }
  }`).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const projects = result.data.allProjectsYaml.edges.map(e => e.node)

    // root /projects is equivalent to /projects/first_project_slug
    createPage({
      path: '/projects',
      component: projectTemplate,
      context: { slug: projects[0].slug },
    })

    projects.forEach(node => {
      createPage({
        path: `/projects/${node.slug}`,
        component: projectTemplate,
        context: { slug: node.slug },
      })
    })
  })
}
