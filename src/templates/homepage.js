import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'

import { sansfont, childLink, CenterContainer } from '../layouts/emotion-base'
import ProjectDescription from '../components/ProjectDescription'
import ProjectDesigners from '../components/ProjectDesigners'
import { chooseProjectImage, imageInfo, projectLink, designerLink } from '../util'

const homepageBreakpoint1 = `max-width: 1000px`

const FeaturedWrapper = styled.div`
  margin: auto;
  max-width: 960px;

  @media (${homepageBreakpoint1}) {
    max-width: 95vw;
  }
`

const ProjectTitle = styled.h2`
  composes: ${sansfont}, ${childLink};
  margin: 0 0 20px 0;
  font-weight: 600;
  font-size: 28px;
  text-align: center;

  & .light {
    font-weight: 100;
  }

  @media (${homepageBreakpoint1}) {
    font-size: 24px;
  }
`

const ImageWrapper = styled.div`
  text-align: center;

  & img {
    max-width: 100%;
    max-height: 70vh;
    user-select: none;
    margin-bottom: 20px;

    @media (max-height: 600px) {
      max-height: 420px;
    }
  }
`

const subHeader = css`
  composes: ${sansfont};
  margin-bottom: 20px;
  font-size: 24px;
  line-height: 1;
`

const Designers = styled.div`
  composes: ${subHeader};
  font-weight: 500;
`

const When = styled.div`
  composes: ${subHeader};
  font-size: 20px;
  font-weight: 100;
`

export default function Homepage({ data, pathContext }) {
  const { project, allDesignersYaml, designer } = data
  const { title, featuredImage, featuredExternalLink } = pathContext
  const image = featuredImage ? imageInfo(featuredImage) : null
  const link = featuredExternalLink || projectLink(project) || designerLink(designer.slug)

  return (
    <div>
      <Helmet
        title={`Salon 94 Design`}
        description={title}
      />
      <CenterContainer>
        <FeaturedWrapper>
          <ProjectTitle>
            {
              featuredExternalLink
               ? <a href={link}>{title}</a>
               : <Link to={link}>{title}</Link>
            }
          </ProjectTitle>
          <ImageWrapper>
            <Link to={link}>
              <img
                src={image && image.src}
                srcSet={image && image.srcSet}
                sizes={`1200px, (${homepageBreakpoint1}): 95vw`}
              />
            </Link>
          </ImageWrapper>
        </FeaturedWrapper>
      </CenterContainer>
    </div>
  )
}

// I include the gql fragments in the index just to colocate them
export const pageQuery = graphql`
  fragment linkDesignerEdges on DesignersYamlConnection {
    edges {
      node {
        slug
        title
        status
      }
    }
  }

  fragment linkProjectEdges on ProjectsYamlConnection {
    edges {
      node {
        slug
        title
        type
        start_date
        end_date
        designers {
          slug
        }
      }
    }
  }

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

  fragment projectListFields on ProjectsYaml {
    slug
    title
    type
    description
    descriptionHtml
    when
    start_date
    end_date
    designers {
      slug
    }
  }

  fragment fullProjectFields on ProjectsYaml {
    ...projectListFields
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
    video {
      vimeoId
      caption
    }
  }

  query HomepageQuery($featuredProjectSlug: String!, $featuredDesignerSlug: String!) {
    project: projectsYaml(slug: { eq: $featuredProjectSlug }) {
      ...fullProjectFields
    }
    designer: designersYaml(slug: { eq: $featuredDesignerSlug }) {
      slug
      title
      status
      bio
      bioHtml
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
