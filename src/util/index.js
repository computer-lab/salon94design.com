const path = require('path')

import React from 'react'
import Link from 'gatsby-link'

import { tagCategory } from './tag'
export * from './tag'

export const workImagePath = name =>
  __PATH_PREFIX__ + `/images/${path.basename(name)}`

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

export const choice = arr => {
  if (!arr) return null
  return arr[Math.floor(arr.length * Math.random())]
}

export const chooseDesignerImage = designer => {
  let image = null

  const work = choice(designer.works)
  if (work && work.images && work.images.length > 0) {
    image = workImagePath(work.images[0].file)
  }

  return image
}

export const chooseProjectImage = (project, designers) => {
  let image = null

  const work = designers.reduce((work, designer) => {
    if (work || !designer.works) return work
    const projectWorks = designer.works.filter(work => {
      return work.projects && work.projects.find(p => p.slug === project.slug)
    })
    return choice(projectWorks)
  }, null)

  if (work && work.images && work.images.length > 0) {
    image = workImagePath(images[0].file)
  }

  if (!image && designers.length > 0) {
    image = chooseDesignerImage(designers[0])
  }

  return image
}

export const getAllTags = designers => {
  const tagSet = new Set()
  designers.forEach(designer => {
    const works = designer.works || []
    works.forEach(work => {
      const tags = (work.tags || [])
        .filter(t => !!t)
        .map(t => t.trim())
        .filter(t => t.length > 0)

      tags.forEach(t => tagSet.add(tagCategory(t)))
    })
  })

  const tags = Array.from(tagSet).sort(
    (a, b) => (Number(a) && Number(b) ? b.localeCompare(a) : a.localeCompare(b))
  )

  return tags
}

export const workImageTexts = ({
  work,
  designer,
  projects,
  smallText = false,
}) => {
  let data = [work.medium, work.dimensions, work.price, work.when].filter(
    item => item && item.length > 0
  )
  if (projects && work.projects) {
    data = data.concat(
      work.projects.map(workProject => {
        const project = projects.find(p => p.slug === workProject.slug)
        return (
          <Link to={projectLink(workProject.slug)} key={workProject.slug}>
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
