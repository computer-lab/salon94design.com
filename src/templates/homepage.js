import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { sansfont } from '../layouts/emotion-base'
import { PageContainer } from '../layouts/containers'
import { chooseProjectImage, imageInfo } from '../util'

const homepageBreakpoint1 = `max-width: 1050px`

const FeaturedWrapper = styled.div`
  margin: 0 auto;
`

const FeaturedHeader = styled.h1`
  composes: ${sansfont};
  margin: 0 0 20px 0;
  font-weight: 600;
  font-size: 28px;
  text-align: center;

  @media (${homepageBreakpoint1}) {
    font-size: 24px;
  }
`

const FeaturedImageWrapper = styled.div`
  max-width: 1024px;

  & img {
    width: 100%;
    user-select: none;
  }

  @media (${homepageBreakpoint1}) {
    max-width: 95vw;
  }
`

export default function Homepage({ data }) {
  const { project, allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  const image = imageInfo(chooseProjectImage(project, designers))

  const title =
    project.type === 'Exhibition' ? `Current Exhibition` : `Current Fair`

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - ${project.title}`}
        description={`${project.title} is Salon 94 Design's current exhibition`}
      />
      <FeaturedWrapper>
        <FeaturedHeader>{title}</FeaturedHeader>
        <FeaturedImageWrapper>
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={`1200px, (${homepageBreakpoint1}): 95vw`}
          />
        </FeaturedImageWrapper>
      </FeaturedWrapper>
    </PageContainer>
  )
}

// I include the gql fragments in the index just to colocate them
export const pageQuery = graphql`
  fragment baseHydratedImages on works_2 {
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

  fragment baseWorkFields on DesignersYaml {
    works {
      slug
      title
      hero
      ...baseHydratedImages
    }
  }

  fragment fullWorkFields on DesignersYaml {
    works {
      slug
      title
      when
      hero
      projects {
        slug
      }
      video {
        vimeoId
        caption
      }
      tags
      caption
      price
      medium
      dimensions
      edition
      ...baseHydratedImages
    }
  }

  fragment fullProjectFields on ProjectsYaml {
    slug
    title
    type
    description
    when
    date
    designers {
      slug
    }
    hydratedImages {
      hero
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

  query HomepageQuery($featuredProjectSlug: String!) {
    project: projectsYaml(slug: { eq: $featuredProjectSlug }) {
      ...fullProjectFields
    }
    allDesignersYaml(sort: { order: ASC, fields: [title] }) {
      edges {
        node {
          slug
          title
          status
          ...baseWorkFields
        }
      }
    }
  }
`
