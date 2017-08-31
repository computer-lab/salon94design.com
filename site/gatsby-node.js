const path = require('path')

exports.createPages = props => {
  return Promise.all([
    createBlogPosts(props),
    createProjects(props),
    createDesigners(props),
    createPieces(props)
  ])
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

  const template = path.resolve(`src/templates/project.js`)

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
      component: template,
      context: { slug: projects[0].slug },
    })

    projects.forEach(node => {
      createPage({
        path: `/projects/${node.slug}`,
        component: template,
        context: { slug: node.slug },
      })
    })
  })
}

function createDesigners({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  const template = path.resolve(`src/templates/designer.js`)

  return graphql(`{
    allDesignersYaml(
      sort: { order: ASC, fields: [name] }
    ) {
      edges {
        node {
          slug
          name
        }
      }
    }
  }`).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const designers = result.data.allDesignersYaml.edges.map(e => e.node)

    // root /designers is equivalent to /designers/first_designer_slug
    createPage({
      path: '/designers',
      component: template,
      context: { slug: designers[0].slug },
    })

    designers.forEach(node => {
      createPage({
        path: `/designers/${node.slug}`,
        component: template,
        context: { slug: node.slug },
      })
    })
  })
}

function createPieces({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  const template = path.resolve(`src/templates/pieces.js`)

  return graphql(`{
    allDesignersYaml{
      edges {
        node {
          pieces {
            tags
            when
          }
        }
      }
    }
  }`).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const designers = result.data.allDesignersYaml.edges.map(e => e.node)
    const pieces = designers
      .map(d => d.pieces)
      .reduce((arr, p) => arr.concat(p), [])

    const tagSet = new Set()
    pieces.forEach(p => {
      tagSet.add(p.when)
      p.tags.forEach(tag => {
        tagSet.add(tag)
      })
    })

    const tags = Array.from(tagSet).sort()

    // root /pieces is equivalent to /pieces/first_alphabetical_tag
    createPage({
      path: '/pieces',
      component: template,
      context: { currentTag: tags[0] },
    })

    tags.forEach(tag => {
      createPage({
        path: `/pieces/${tag}`,
        component: template,
        context: { currentTag: tag },
      })
    })
  })
}
