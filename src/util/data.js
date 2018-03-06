import React from 'react'
import Link from 'gatsby-link'

import { choice } from './index'
import { designerLink, projectLink, workLink } from './path'
import { getCategoryTags } from './tag'

export const chooseWorksImage = works => {
  let heroWorks = works.filter(w => w.hero)
  if (heroWorks.length === 0) {
    heroWorks = works
  }
  heroWorks = heroWorks.filter(
    w => w.hydratedImages && w.hydratedImages.length > 0
  )

  const work = choice(heroWorks)
  return work ? work.hydratedImages[0] : null
}

export const chooseDesignerImage = designer =>
  chooseWorksImage(designer.works || [])

export const chooseCategoryImage = (designers, works, category) => {
  const tagSet = new Set(getCategoryTags(designers, category))
  return chooseTagSetImage(works, tagSet)
}

export const chooseTagImage = (works, tag) =>
  chooseTagSetImage(works, new Set([tag]))

export const chooseTagSetImage = (works, tagSet) => {
  const worksInCategory = works
    .filter(
      work => work.tags && work.tags.filter(t => tagSet.has(t)).length > 0
    )
    .filter(work => work.hydratedImages && work.hydratedImages.length > 0)

  if (worksInCategory.length === 0) {
    return null
  }

  const heroWorks = worksInCategory.filter(w => w.hero)
  const work =
    heroWorks.length > 0 ? choice(heroWorks) : choice(worksInCategory)
  const image = work.hydratedImages[0]
  return image
}

export const chooseProjectImage = (project, designers) => {
  if (project.hydratedImages && project.hydratedImages.length > 0) {
    const heroImages = project.hydratedImages.filter(i => i && i.hero)
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
  includeDesigner = true,
  smallText = null,
}) => {
  let data = []
  if (includeDesigner) {
    data.push(<Link style={{'fontWeight': 500}} to={designerLink(designer.slug)}>{designer.title}</Link>)
  }

  data.push(<Link style={{'fontStyle': 'italic'}} to={workLink(designer.slug, work.slug)}>{work.title}</Link>)

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
    const projectLinks = work.projects
      .filter(p => p && p.slug)
      .map(workProject => {
        const project = projects.find(p => p && p.slug === workProject.slug)
        return project ? (
          <Link to={projectLink(workProject)} key={workProject.slug}>
            {project.title}
          </Link>
        ) : null
      })
      .filter(project => project !== null)

    if (projectLinks.length > 0) {
      const projectLabel = projectLinks.length > 1 ? 'Projects' : 'Project'
      data.push(
        <div>
          {projectLabel} – {projectLinks}
        </div>
      )
    }
  }

  return {
    smallText,
    items: data,
  }
}

export const byLastName = (designerA, designerB) => {
  const getLastName = designer => {
    return designer.title
      ? designer.title
          .trim()
          .split(' ')
          .pop()
      : ''
  }
  return getLastName(designerA).localeCompare(getLastName(designerB))
}
