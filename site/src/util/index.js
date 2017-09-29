import React from 'react'
import Link from 'gatsby-link'

import { tagCategory } from './tag'
export * from './tag'

export const workImagePath = name => require(`../assets/images/${name}`)

export const designerLink = slug => `/designers/${slug}`

export const projectLink = slug => `/projects/${slug}`

export const workLink = (dslug, pslug) => `/designers/${dslug}/${pslug}`

export const workTagLink = tag => {
  return `/works/${tagCategory(tag)}`
}

export const capitalize = str =>
  str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const choice = arr => arr[Math.floor(arr.length * Math.random())]

export const workImageTexts = ({
  work,
  designer,
  projects,
  smallText = false,
}) => {
  let data = [work.medium, work.dimensions, work.price, work.when].filter(
    item => item && item.length > 0
  )
  if (projects) {
    data = data.concat(
      work.projects.map(slug => {
        const project = projects.find(p => p.slug === slug)
        return (
          <Link to={projectLink(slug)} key={slug}>
            {project.title}
          </Link>
        )
      })
    )
  }

  return {
    data,
    smallText: smallText ? (
      <div>
        <Link to={workLink(designer.slug, work.slug)}>{work.title} </Link>
        – <Link to={designerLink(designer.slug)}>{designer.name}</Link>
        , {work.when}
      </div>
    ) : null,
    title: <Link to={workLink(designer.slug, work.slug)}>{work.title}</Link>,
    caption: work.caption,
    credit: <Link to={designerLink(designer.slug)}>{designer.name}</Link>,
  }
}
