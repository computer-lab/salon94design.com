import React, { Component } from 'react'
import Helmet from '../components/helmet'

import { PageContainer } from '../layouts/containers'
import ProjectList from '../components/project-list'

export default function Exhibitions({ data }) {
  const { allProjectsYaml, allDesignersYaml } = data

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - Exhibitions`}
        description={`List of Salon 94 Design exhibtions and projects`}
      />
      <ProjectList
        allProjectsYaml={allProjectsYaml}
        allDesignersYaml={allDesignersYaml}
        type="Exhibition"
      />
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query ExhibitionsQuery {
    allProjectsYaml(sort: { order: DESC, fields: [date, title] }) {
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
