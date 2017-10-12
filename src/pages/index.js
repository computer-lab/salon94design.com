import React from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import ImageList from '../layouts/ImageList'
import WorkSummary from '../layouts/WorkSummary'
import { imageLargePath, imageSrcSet, workLink } from '../util'

const IndexPage = ({ data }) => {
  const { allProjectsYaml, allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const homepageProjectSlugs = projects.filter(p => p.homepage).map(p => p.slug)
  const filterWork = work => {
    const projects = work.projects || []
    for (let i = 0; i < projects.length; i++) {
      if (homepageProjectSlugs.includes(projects[i].slug)) {
        return true
      }
    }

    return false
  }

  let images = []
  designers.forEach(designer => {
    const works = (designer.works || []).filter(filterWork)
    works.forEach(work => {
      if (work.images && work.images.length > 0) {
        const image = work.images[0]
        images.push({
          src: imageLargePath(image),
          srcSet: imageSrcSet(image),
          unexpandedLink: workLink(designer.slug, work.slug),
          designer,
          work,
        })
      }
    })
  })

  // randomize image order
  images.sort(() => Math.random() - 0.5)

  const imageSets = [{ images }]

  const hoverImageRenderer = hoverImage => (
    <WorkSummary work={hoverImage.work} designer={hoverImage.designer} />
  )

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design`} />
      <div>
        <ImageList
          imageSets={imageSets}
          unexpandable={true}
          centerImages={true}
          hoverImageRenderer={hoverImageRenderer}
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
          homepage
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
              width
              height
              resized {
                file
                width
                height
              }
            }
            caption
            price
            medium
            dimensions
          }
        }
      }
    }
  }
`
