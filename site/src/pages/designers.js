import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import SectionItemList from '../layouts/SectionItemList'
import { pieceImagePath, designerLink, choice } from '../util'

export default function Projects({ data }) {
  const { allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  const listItems = designers.map(designer => {
    const image = choice(designer.pieces).images[0]

    return {
      title: designer.name,
      image: pieceImagePath(image),
      link: designerLink(designer.slug),
    }
  })

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Designers`} />
      <div>
        <SectionItemList title="Designers" items={listItems} />
      </div>
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query DesignersQuery {
    allDesignersYaml(sort: { order: ASC, fields: [name] }) {
      edges {
        node {
          slug
          name
          pieces {
            slug
            title
            images
          }
        }
      }
    }
  }
`
