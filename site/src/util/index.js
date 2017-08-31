import React from 'react'
import Link from 'gatsby-link'

export const pieceImagePath = name => require(`../assets/images/${name}.jpg`)

export const designerLink = slug => `/designers/${slug}`

export const projectLink = slug => `/projects/${slug}`

export const pieceLink = (dslug, pslug) => `/designers/${dslug}/${pslug}`
export const pieceTagLink = tag => `/pieces/${tag}`

export const capitalize = str => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

export const pieceImageTexts = ({ piece, designer, projects, smallText = false }) => {
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
    data,
    smallText: smallText ? (
      <div>
        <Link to={designerLink(designer.slug)}>
          {designer.name}
        </Link>
        , {piece.when}
      </div>
    ) : null,
    title: (
      <Link to={pieceLink(designer.slug, piece.slug)}>
        {piece.title}
      </Link>
    ),
    caption: piece.caption,
    credit: (
      <Link to={designerLink(designer.slug)}>
        {designer.name}
      </Link>
    ),
  }
}
