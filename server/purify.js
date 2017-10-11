
const { getDesigners, getProjects, updateDesignerFile, updateProjectFile } = require('./data')

module.exports = main

async function main () {
  await processProjects()
  await processDesigners()
}

async function processProjects () {
  const projects = await getProjects()

  const impureProjects = projects.filter(project =>
    project.slug !== slugify(project.slug)
  )

  const pureProjects = await Promise.all(impureProjects.map(project =>
    Object.assign({}, project, {
      slug: slugify(project.slug)
    })
  ))

  await Promise.all(pureProjects.map(data =>
    updateProjectFile(data)
  ))
}

async function processDesigners () {
  const designers = await getDesigners()

  const impureDesigners = designers.filter(designer =>
    designer.slug !== slugify(designer.slug) ||
    designer.works.filter(work =>
      work.slug !== slugify(work.slug)
    ).length > 0
  )

  const pureDesigners = await Promise.all(impureDesigners.map(designer =>
    Object.assign({}, designer, {
      slug: slugify(designer.slug),
      works: designer.works.map(work => Object.assign({}, {
        slug: slugify(work.slug)
      }, work))
    })
  ))

  await Promise.all(pureDesigners.map(data =>
    updateDesignerFile(data)
  ))
}

function slugify (str) {
  return str
    .replace(/\s+/g, '-') // replace whitespace with dashes
    .replace(/[|&;$%@"<>()+,]/g, '') // remove weird non-url-friendly characters
    .toLowerCase()
}
