const path = require('path')
const util = require('util')
const remark = require('remark')
const html = require('remark-html')
const {
  projectLink,
  workTagLink,
  categoryLink,
  workLink,
} = require('./src/util/path')
const { getAllTags } = require('./src/util/tag')
const { readdirAbsolute } = require('./transformer/data')
const { getImageData, getWorkImageFilename, getProjectImageFilename, getInfoImageFilename } = require('./transformer/images')

exports.createPages = props => {
  return Promise.all([
    createIndex(props),
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

function createIndex({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  return graphql(`
    {
      allLandingPageYaml {
        edges {
          node {
            featuredProjectSlug
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) return Promise.reject(result.errors)

    const { featuredProjectSlug } = result.data.allLandingPageYaml.edges[0].node
    createPage({
      path: '/',
      component: path.resolve(`src/templates/homepage.js`),
      context: { featuredProjectSlug },
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
            designers {
              slug
            }
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
        context: {
          slug: node.slug,
          designersRegex: getSlugsRegex(node.designers),
        },
      })
    })
  })
}

function createDesigners({ boundActionCreators, graphql }) {
  const { createPage } = boundActionCreators

  const template = path.resolve(`src/templates/designer.js`)

  return graphql(`
    {
      allDesignersYaml(sort: { order: ASC, fields: [title] }) {
        edges {
          node {
            slug
            title
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
  const worksByTagTemplate = path.resolve(`src/templates/worksByTag.js`)
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
              projects {
                slug
              }
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

    // create page for each tag
    tags.forEach(tag => {
      createPage({
        path: workTagLink(tag),
        component: worksByTagTemplate,
        context: { tag },
      })
    });

    // create page for each work
    works.forEach(work => {
      createPage({
        path: workLink(work.designer.slug, work.slug),
        component: workTemplate,
        context: {
          designerSlug: work.designer.slug,
          workSlug: work.slug,
          projectsRegex: getSlugsRegex(work.projects),
        },
      })
    })
  })
}

function getSlugsRegex(items) {
  const slugs = (items || [])
    .filter(item => item && item.slug)
    .map(item => item.slug)
    .filter(el => !!el)
  return slugs.length > 0 ? `/(${slugs.join('|')})/` : `/null/`
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

  const hydrateImages = async (node, nameProvider, addDummyImages = false) => {
    if (node.images) {
      node.hydratedImages = await Promise.all(node.images.map((image, idx) => hydrateImage(image, idx, nameProvider)))
        .filter(item => !!item)
    }

    // necessary for some graphql queries
    if (
      addDummyImages &&
      (!node.hydratedImages || node.hydratedImages.length === 0)
    ) {
      const nullImage = { file: '', width: 0, height: 0 }
      node.hydratedImages = [
        { ...nullImage, title: '', resized: [{ ...nullImage }] },
      ]
    }
  }

  const processPress = node => {
    if (node.press && node.press.length > 0) {
      node.press = node.press.map(item =>
        Object.assign({ file: '', link: '', title: '' }, item)
      )
    } else {
      node.press = [{ file: '', link: '', title: '' }]
    }
  }

  switch (node.internal.type) {
    case 'InfoYaml':
      {
        const html = await markdownToHtml(node.aboutText)
        node.aboutHtml = html.contents

        processPress(node)

        const nameProvider = (img, idx) => getInfoImageFilename(img, idx, '.jpg')
        await hydrateImages(node, nameProvider, true)
      }
      break

    case 'DesignersYaml':
      {
        const html = await markdownToHtml(node.bio)
        node.bioHtml = html.contents

        processPress(node)

        const works = node.works || []
        await Promise.all(works.map(async work => {
          const nameProvider = (img, idx) => getWorkImageFilename(node, work, img, idx, '.jpg')
          await hydrateImages(work, nameProvider)
        }))
      }
      break

    case 'ProjectsYaml':
      {
        const html = await markdownToHtml(node.description)
        node.descriptionHtml = html.contents

        const nameProvider = (img, idx) => getProjectImageFilename(node, img, idx, '.jpg')
        await hydrateImages(node, nameProvider)
      }
      break
  }
}

async function hydrateImage(image, idx, nameProvider) {
  if (!image || !image.file || !nameProvider) {
    return null
  }

  const localFilename = nameProvider(image, idx)

  const images = await readdirAbsolute(path.dirname(localFilename))
  const resizedImages = images.filter(n => n !== localFilename)

  try {
    const imageData = await getImageData(localFilename)
    return Object.assign({}, image, imageData, {
      resized: await Promise.all(resizedImages.map(getImageData)),
    })
  } catch (err) {
    console.error('error hydrating image')
    console.error(image)
    console.error(err)
    return null
  }
}
