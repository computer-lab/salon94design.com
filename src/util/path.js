const { basename } = require('path')

import { tagCategory } from './tag'

export const imagePath = name =>
  __PATH_PREFIX__ + `/images/${name}`

export const designerLink = slug => `/designers/${slug}`

export const projectLink = slug => `/projects/${slug}`

export const workLink = (dslug, pslug) => `/designers/${dslug}/${pslug}`

export const workTagLink = tag => {
  return `/works/${tagCategory(tag)}`
}
