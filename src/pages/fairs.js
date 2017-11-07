import React, { Component } from 'react'
import Helmet from '../components/helmet'

import { PageContainer } from '../layouts/containers'
import ProjectList from '../components/project-list'

export default function ArtFairs({ data }) {
  const { allProjectsYaml, allDesignersYaml } = data

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - Fairs`}
        description={`List of Salon 94 Design Fairs`}
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
          ...fullProjectFields
        }
      }
    }
    allDesignersYaml {
      edges {
        node {
          slug
          title
          ...baseWorkFields
        }
      }
    }
  }
`
