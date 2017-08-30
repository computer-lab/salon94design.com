import React from 'react'
import Link from 'gatsby-link'

export const pieceImagePath = name => require(`../assets/images/${name}.jpg`)

export const designerLink = slug => `/designers/${slug}`

export const projectLink = slug => `/projects/${slug}`

export const pieceLink = (dslug, pslug) => `/designers/${dslug}/${pslug}`

export const pieceImageTexts = ({ piece, designer, projects }) => {
  let data = [piece.price, piece.when]
  if (projects) {
    data = data.concat(
      piece.projects.map(slug => {
        const project = projects.find(p => p.slug === slug)
        return (
          <Link to={projectLink(slug)}>
            {project.title}
          </Link>
        )
      })
    )
  }

  return {
    title: (
      <Link to={pieceLink(designer.slug, piece.slug)}>
        {piece.title}
      </Link>
    ),
    caption: piece.caption,
    data: data,
    credit: (
      <Link to={designerLink(designer.slug)}>
        {designer.name}
      </Link>
    ),
  }
}
