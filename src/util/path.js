const { getTagCategory } = require('./tag')

const designerLink = slug => (slug ? `/designers/${slug}` : null)

const projectLink = project => {
  if (!project) return null
  switch (project.type) {
    case 'Art Fair':
      return `/fairs/${project.slug}`
    case 'Exhibition':
    default:
      return `/exhibitions/${project.slug}`
  }
}

const workLink = (dslug, pslug) => `/designers/${dslug}/${pslug}`

const workTagLink = tag => `/works/${tag}`

module.exports = {
  designerLink,
  projectLink,
  workLink,
  workTagLink,
}
