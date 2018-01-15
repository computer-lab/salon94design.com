const { getTagCategory } = require('./tag')

const designerLink = slug => `/designers/${slug}`

const projectLink = project => {
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
