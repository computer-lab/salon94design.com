import React from 'react'
import Link from 'gatsby-link'

import { choice } from './index'
import { designerLink, projectLink, workLink } from './path'
import { categoryTags } from './tag'

export const chooseWorksImage = works => {
  let heroWorks = works.filter(w => w.hero)
  if (heroWorks.length === 0) {
    heroWorks = works
  }
  heroWorks = heroWorks.filter(
    w => w.hydratedImages && w.hydratedImages.length > 0
  )

  const work = heroWorks[0]
  return work ? work.hydratedImages[0] : null
}

export const chooseDesignerImage = designer =>
  chooseWorksImage(designer.works || [])

export const chooseCategoryImage = (works, tag) => {
  const tagSet = new Set(categoryTags(tag))
  const worksInCategory = works
    .filter(
      work => work.tags && work.tags.filter(t => tagSet.has(t)).length > 0
    )
    .filter(work => work.hydratedImages && work.hydratedImages.length > 0)

  if (worksInCategory.length === 0) {
    return null
  }

  const heroWorks = worksInCategory.filter(w => w.hero)
  const work = heroWorks.length > 0 ? heroWorks[0] : choice(worksInCategory)
  const image = work.hydratedImages[0]
  return image
}

export const chooseProjectImage = (project, designers) => {
  if (project.hydratedImages && project.hydratedImages.length > 0) {
    const heroImages = project.hydratedImages.filter(i => i.hero)
    return heroImages.length > 0 ? heroImages[0] : project.hydratedImages[0]
  }

  const projectWorks = designers.filter(d => !!d).reduce((works, designer) => {
    return works.concat(
      designer.works.filter(work => {
        return work.projects && work.projects.find(p => p.slug === project.slug)
      })
    )
  }, [])

  const workImage = chooseWorksImage(projectWorks)
  if (workImage) {
    return workImage
  }

  if (designers.length > 0) {
    return chooseDesignerImage(designers[0])
  }

  return null
}

export const workImageTexts = ({
  work,
  designer,
  projects,
  smallText = null,
}) => {
  let data = [
    <Link to={designerLink(designer.slug)}>{designer.name}</Link>,
    <Link to={workLink(designer.slug, work.slug)}>{work.title}</Link>,
  ]

  const elements = [
    work.when,
    work.caption,
    work.medium,
    work.dimensions,
    work.edition,
    work.price,
  ]
  data = data.concat(elements.filter(item => item && item.length > 0))

  if (projects && work.projects) {
    data = data.concat(
      work.projects
        .map(workProject => {
          const project = projects.find(p => p.slug === workProject.slug)
          return project ? (
            <Link to={projectLink(workProject)} key={workProject.slug}>
              {project.title}
            </Link>
          ) : null
        })
        .filter(project => project !== null)
    )
  }

  return {
    smallText,
    items: data,
  }
}

export const byLastName = (designerA, designerB) => {
  const getLastName = designer => {
    return designer.name
      ? designer.name
          .trim()
          .split(' ')
          .pop()
      : ''
  }
  return getLastName(designerA).localeCompare(getLastName(designerB))
}
