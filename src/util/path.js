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

const categoryLink = category => `/works/${category}`
const workTagLink = tag => {
  const category = getTagCategory(tag)
  return category === tag
    ? `/works/${category}/all`
    : `/works/${category}/${tag}`
}

module.exports = {
  designerLink,
  projectLink,
  workLink,
  workTagLink,
  categoryLink,
}
