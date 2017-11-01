import React from 'react'
import Link from 'gatsby-link'

import { choice } from './index'
import { designerLink, projectLink, workLink } from './path'

export const chooseDesignerImage = designer => {
  let image = null

  const work = choice(designer.works)
  if (work && work.hydratedImages && work.hydratedImages.length > 0) {
    image = work.hydratedImages[0]
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

  if (work && work.hydratedImages && work.hydratedImages.length > 0) {
    image = work.hydratedImages[0]
  }

  if (!image && designers.length > 0) {
    image = chooseDesignerImage(designers[0])
  }

  return image
}

export const workImageTexts = ({
  work,
  designer,
  projects,
  smallText = null,
}) => {
  let data = [work.medium, work.dimensions, work.price, work.when].filter(
    item => item && item.length > 0
  )
  if (projects && work.projects) {
    data = data.concat(
      work.projects
        .map(workProject => {
          const project = projects.find(p => p.slug === workProject.slug)
          return project ? (
            <Link to={projectLink(workProject.slug)} key={workProject.slug}>
              {project.title}
            </Link>
          ) : null
        })
        .filter(project => project !== null)
    )
  }

  return {
    data,
    smallText,
    title: <Link to={workLink(designer.slug, work.slug)}>{work.title}</Link>,
    caption: work.caption,
    credit: <Link to={designerLink(designer.slug)}>{designer.name}</Link>,
  }
}
