import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'

import { sansfont, childLink } from '../layouts/emotion-base'
import { PageContainer } from '../layouts/containers'
import ProjectDescription from '../components/ProjectDescription'
import ProjectDesigners from '../components/ProjectDesigners'
import { chooseProjectImage, imageInfo, projectLink } from '../util'

const homepageBreakpoint1 = `max-width: 1000px`

const FeaturedWrapper = styled.div`
  margin: 0 auto;
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

  @media (${homepageBreakpoint1}) {
    font-size: 24px;
  }
`

const ImageWrapper = styled.div`
  text-align: center;

  & img {
    max-width: 100%;
    user-select: none;
    margin-bottom: 20px;
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
  font-size: 22px;
  font-weight: 100;
`

export default function Homepage({ data }) {
  const { project, allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  const image = imageInfo(chooseProjectImage(project, designers))

  const titleLabel =
    project.type === 'Exhibition' ? `Current Exhibition` : `Current Fair`

  const designerLabel =
    project.designers && project.designers.length > 1 ? 'Designers' : 'Designer'

  const link = projectLink(project)

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - ${project.title}`}
        description={`${project.title} is Salon 94 Design's current exhibition`}
      />
      <FeaturedWrapper>
        <ProjectTitle>
          <Link to={link}>
            {titleLabel} – {project.title}
          </Link>
        </ProjectTitle>
        <ImageWrapper>
          <Link to={link}>
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={`1200px, (${homepageBreakpoint1}): 95vw`}
            />
          </Link>
        </ImageWrapper>
        <Designers>
          <ProjectDesigners project={project} designers={designers} />
        </Designers>
        <When>{project.when}</When>
        <ProjectDescription project={project} />
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

  fragment projectListFields on ProjectsYaml {
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

  fragment fullProjectFields on ProjectsYaml {
    ...projectListFields
    descriptionHtml
    video {
      vimeoId
      caption
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