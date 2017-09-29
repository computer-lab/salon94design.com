import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import ImageList from '../layouts/ImageList'
import { workImagePath, workLink } from '../util'

const IndexPage = ({ data }) => {
  const { allProjectsYaml, allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const currentProject = projects[0]
  const filterWork = p => p.projects.includes(currentProject.slug)

  let images = []
  designers.forEach(designer => {
    designer.works.filter(filterWork).forEach(work => {
      work.images.forEach(image => {
        images.push({
          src: workImagePath(image.file),
          unexpandedLink: workLink(designer.slug, work.slug),
        })
      })
    })
  })

  // TODO: remove temporary image multiplication
  for (let i = 0; i < 5; i++) {
    images = images.concat(images)
  }

  // randomize image order
  images.sort(() => Math.random() - 0.5)

  const imageSets = [{ images }]

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design`} />
      <div>
        <ImageList
          imageSets={imageSets}
          unexpandable={true}
          centerImages={true}
        />
      </div>
    </PageContainer>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query LandingPageQuery {
    allProjectsYaml {
      edges {
        node {
          slug
          title
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
            when
            projects
            tags
            images {
              file
            }
            caption
            price
          }
        }
      }
    }
  }
`
