import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import SectionItemList from '../layouts/SectionItemList'
import { chooseProjectImage, projectLink } from '../util'

export default function Projects({ data }) {
  const { allProjectsYaml, allDesignersYaml } = data

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const getDesigner = designer => designers.find(d => d.slug === designer.slug)

  const listItems = projects.map(project => {
    const designers = (project.designers || []).map(getDesigner)

    return {
      title: project.title,
      subtitle: designers.map(d => d.name).join(' / '),
      image: chooseProjectImage(project, designers),
      link: projectLink(project.slug),
    }
  })

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - Exhibitions`}
        description={`List of Salon 94 Design exhibtions and projects`}
      />
      <div>
        <SectionItemList title="Exhibitions" items={listItems} />
      </div>
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query ProjectsQuery {
    allProjectsYaml(sort: { order: DESC, fields: [groupingYear, title] }) {
      edges {
        node {
          slug
          title
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
