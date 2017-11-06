const path = require('path')
const util = require('util')
const remark = require('remark')
const html = require('remark-html')
const { createFileNode } = require('gatsby-source-filesystem/create-file-node')

const { projectLink } = require('./src/util/path')
const { getAllTags } = require('./src/util/tag')
const { readdirAbsolute } = require('./transformer/data')
const { getImageData } = require('./transformer/images')

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
            type
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const projects = result.data.allProjectsYaml.edges.map(e => e.node)

    projects.forEach(node => {
      createPage({
        path: projectLink(node),
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

  const categoryTemplate = path.resolve(`src/templates/worksByCategory.js`)
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

    const tags = getAllTags(designers)
    // create page for each category
    tags.forEach(category => {
      createPage({
        path: `/works/${category}`,
        component: categoryTemplate,
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

exports.onCreatePage = async ({ page, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    if (page.path.match(/^\/admin/)) {
      page.layout = 'admin'
      createPage(page)
    }

    resolve()
  })
}

exports.onCreateNode = async ({ node, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

  const markdownToHtml = util.promisify(remark().use(html).process)

  const hydrateImages = async node => {
    if (node.images) {
      node.hydratedImages = await Promise.all(node.images.map(hydrateImage))
    }
  }

  switch (node.internal.type) {
    case 'InfoYaml':
      {
        const html = await markdownToHtml(node.aboutText)
        node.aboutHtml = html.contents

        await hydrateImages(node)
      }
      break

    case 'DesignersYaml':
      {
        const html = await markdownToHtml(node.bio)
        node.bioHtml = html.contents

        const works = node.works || []
        await Promise.all(works.map(work => hydrateImages(work)))
      }
      break

    case 'ProjectsYaml':
      {
        const html = await markdownToHtml(node.description)
        node.descriptionHtml = html.contents

        await hydrateImages(node)
      }
      break
  }
}

async function hydrateImage(image) {
  return createFileNode(image.file)


  const localFilename = path.resolve(image.file.replace('/public/', ''))

  const images = await readdirAbsolute(path.dirname(localFilename))
  const resizedImages = images.filter(n => n !== localFilename)

  const imageData = await getImageData(localFilename)
  return Object.assign({}, image, imageData, {
    resized: await Promise.all(resizedImages.map(getImageData)),
  })
}
