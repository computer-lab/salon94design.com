import React, { Component } from 'react'
import Helmet from '../components/helmet'

import { PageContainer } from '../layouts/containers'
import ProjectList from '../components/project-list'

export default function ArtFairs({ data }) {
  const { allProjectsYaml, allDesignersYaml } = data

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - Art Fairs`}
        description={`List of Salon 94 Design Art Fairs`}
      />
      <ProjectList
        allProjectsYaml={allProjectsYaml}
        allDesignersYaml={allDesignersYaml}
        type="Art Fair"
      />
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query ArtFairsQuery {
    allProjectsYaml(sort: { order: DESC, fields: [groupingYear, title] }) {
      edges {
        node {
          slug
          title
          type
          description
          when
          groupingYear
          designers {
            slug
          }
        }
      }
    }
    allDesignersYaml {
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
