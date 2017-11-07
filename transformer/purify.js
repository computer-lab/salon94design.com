const slugify = require('slugify')
const { getDesigners, getProjects, resetDesignerFile, resetProjectFile } = require('./data')

module.exports = main

const slugifyLower = str => slugify(str, {
  lower: true,
  remove: /[$*+~.()'"!\:@]/g
})

async function main () {
  await processProjects()
  await processDesigners()
}

async function processProjects () {
  const projects = await getProjects()

  const impureProjects = projects.filter(project =>
    project.slug !== slugifyLower(project.slug)
  )

  await Promise.all(impureProjects.map(project => {
    const pureProject = Object.assign({}, project, {
      slug: slugifyLower(project.slug)
    })

    return resetProjectFile(pureProject)
  }))
}

async function processDesigners () {
  const designers = await getDesigners()

  const impureDesigners = designers.filter(designer =>
    designer.slug !== slugifyLower(designer.slug) ||
    (designer.works || []).filter(work =>
      work.slug !== slugifyLower(work.slug)
    ).length > 0
  )

  await Promise.all(impureDesigners.map(designer => {
    const pureDesigner = Object.assign({}, designer, {
      slug: slugifyLower(designer.slug),
      works: (designer.works || []).map(work => Object.assign({}, work, {
        slug: slugifyLower(work.slug)
      }))
    })

    return resetDesignerFile(pureDesigner)
  }))
}
