import React, { Component } from 'react'
import Helmet from '../components/helmet'

import ProjectList from '../components/project-list'

export default function ArtFairs({ data }) {
  const { allProjectsYaml, allDesignersYaml } = data

  return (
    <div>
      <Helmet
        title={`Salon 94 Design - Fairs`}
        description={`List of Salon 94 Design Fairs`}
      />
      <ProjectList
        allProjectsYaml={allProjectsYaml}
        allDesignersYaml={allDesignersYaml}
        type="Art Fair"
      />
    </div>
  )
}

export const pageQuery = graphql`
  query ArtFairsQuery {
    allProjectsYaml(sort: { order: DESC, fields: [start_date, title] }) {
      edges {
        node {
          ...projectListFields
        }
      }
    }
    allDesignersYaml {
      edges {
        node {
          slug
          title
        }
      }
    }
  }
`
