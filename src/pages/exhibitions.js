import React, { Component } from 'react'
import Helmet from '../components/helmet'

import ProjectList from '../components/project-list'

export default function Exhibitions({ data }) {
  const { allProjectsYaml, allDesignersYaml } = data

  return (
    <div>
      <Helmet
        title={`Salon 94 Design - Exhibitions`}
        description={`List of Salon 94 Design exhibtions and projects`}
      />
      <ProjectList
        allProjectsYaml={allProjectsYaml}
        allDesignersYaml={allDesignersYaml}
        type="Exhibition"
      />
    </div>
  )
}

export const pageQuery = graphql`
  query ExhibitionsQuery {
    allProjectsYaml(sort: { order: DESC, fields: [date, title] }) {
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
          ...baseWorkFields
        }
      }
    }
  }
`
