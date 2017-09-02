import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import SectionItemList from '../layouts/SectionItemList'
import { pieceImagePath, projectLink, choice } from '../util'

export default function Projects({ data }) {
  const { allProjectsYaml, allDesignersYaml } = data

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const getDesigner = slug => designers.find(d => d.slug === slug)

  const listItems = projects.map(project => {
    const designers = project.designers.map(getDesigner)
    const image = choice(designers[0].pieces).images[0]
    const title = `${project.title}\n${designers.map(d => d.name).join(' / ')}`

    return {
      title,
      image: pieceImagePath(image),
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
          designers
        }
      }
    }
    allDesignersYaml {
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
