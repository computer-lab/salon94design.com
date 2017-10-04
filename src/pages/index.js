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
  const currentProject = projects.find(p => p.slug === 'gold-chicken-wire')
  const filterWork = work =>
    work.projects &&
    work.projects.map(project => project.slug).includes(currentProject.slug)

  let images = []
  designers.forEach(designer => {
    const works = (designer.works || []).filter(filterWork)
    works.forEach(work => {
      ;(work.images || []).forEach(image => {
        images.push({
          src: workImagePath(image.file),
          unexpandedLink: workLink(designer.slug, work.slug),
        })
      })
    })
  })

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
            projects {
              slug
            }
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