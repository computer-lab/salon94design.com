const path = require('path')
const { tagCategory } = require('./src/util/tag')

exports.createPages = props => {
  return Promise.all([
    // createBlogPosts(props),
    createProjects(props),
    createDesigners(props),
    createWorks(props),
  ])
}

function createBlogPosts({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  const postTemplate = path.resolve(`src/templates/post.js`)

  return graphql(`
    {
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
    }
  `).then(result => {
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

  return graphql(`
    {
      allProjectsYaml(sort: { order: DESC, fields: [when] }) {
        edges {
          node {
            slug
            when
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const projects = result.data.allProjectsYaml.edges.map(e => e.node)

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

  return graphql(`
    {
      allDesignersYaml(sort: { order: ASC, fields: [name] }) {
        edges {
          node {
            slug
            name
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const designers = result.data.allDesignersYaml.edges.map(e => e.node)

    designers.forEach(node => {
      createPage({
        path: `/designers/${node.slug}`,
        component: template,
        context: { slug: node.slug },
      })
    })
  })
}

function createWorks({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  const worksByCategoryTemplate = path.resolve(
    `src/templates/worksByCategory.js`
  )
  const workTemplate = path.resolve(`src/templates/work.js`)

  return graphql(`
    {
      allDesignersYaml {
        edges {
          node {
            slug
            works {
              slug
              tags
              when
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const designers = result.data.allDesignersYaml.edges.map(e => e.node)
    const works = designers
      .map(d => d.works.map(p => Object.assign({}, p, { designer: d })))
      .reduce((arr, p) => arr.concat(p), [])

    const categorySet = new Set()

    works.forEach(p => {
      p.tags.forEach(tag => {
        categorySet.add(tagCategory(tag))
      })
    })

    const categories = Array.from(categorySet).sort()

    // create page for each category
    categories.forEach(category => {
      createPage({
        path: `/works/${category}`,
        component: worksByCategoryTemplate,
        context: { currentCategory: category },
      })
    })

    // create page for each work
    works.forEach(work => {
      createPage({
        path: `/designers/${work.designer.slug}/${work.slug}`,
        component: workTemplate,
        context: { designerSlug: work.designer.slug, workSlug: work.slug },
      })
    })
  })
}

exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    if (page.path.match(/^\/admin/)) {
      page.layout = 'admin'
      createPage(page)
    }

    resolve()
  })
}
