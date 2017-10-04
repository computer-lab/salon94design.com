import React, { Component } from 'react'
import Helmet from 'react-helmet'
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
      <Helmet title={`Salon 94 Design - Projects`} />
      <div>
        <SectionItemList title="Projects" items={listItems} />
      </div>
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query ProjectsQuery {
    allProjectsYaml(sort: { order: DESC, fields: [when] }) {
      edges {
        node {
          slug
          title
          description
          when
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
            images {
              file
            }
          }
        }
      }
    }
  }
`
