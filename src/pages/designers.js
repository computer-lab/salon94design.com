import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import SectionItemList from '../layouts/SectionItemList'
import { chooseDesignerImage, designerLink } from '../util'

export default function Projects({ data }) {
  const { allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  const listItems = designers.map(designer => {
    return {
      title: designer.name,
      image: chooseDesignerImage(designer),
      link: designerLink(designer.slug),
    }
  })

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - Designers`}
        description={`List of designers represented by Salon 94 Design.`}
      />
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
          works {
            slug
            title
            hydratedImages {
              file
              width
              height
              resized {
                file
                width
                height
              }
            }
          }
        }
      }
    }
  }
`
