import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import {
  sansfont,
  monofont,
  Header1,
  breakpoint1,
  breakpoint2,
  breakpoint3,
} from '../layouts/emotion-base'
import HiddenSelector from '../layouts/HiddenSelector'
import DesignerBio from '../layouts/DesignerBio'
import DesignerProjects from '../layouts/DesignerProjects'
import Press from '../layouts/Press'
import ImageList from '../layouts/ImageList'
import WorkSummary from '../layouts/WorkSummary'
import { workImagePath, workImageTexts, designerLink, workLink } from '../util'

const { LeftPane, RightPane } = createPanes('370px')

const WorksHeader = styled.h2`
  composes: ${sansfont};
  margin: 0 0 16px 0;
  padding: 0;
  font-weight: 500;
  font-size: 36px;

  @media (${breakpoint1}) {
    margin: 15px 0 28px 0;
    font-size: 24px;
  }
`

const DesignerTemplate = ({ data, pathContext }) => {
  const { allProjectsYaml, allDesignersYaml } = data
  const { slug: currentDesignerSlug } = pathContext

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const currentDesigner = designers.find(d => d.slug === currentDesignerSlug)

  const projects = allProjectsYaml.edges
    .map(edge => edge.node)
    .filter(project =>
      (project.designers || [])
        .map(designer => designer.slug)
        .includes(currentDesignerSlug)
    )

  const works = currentDesigner.works || []
  const images = works
    .filter(work => work.images && work.images.length > 0)
    .map(work => ({
      work,
      src: workImagePath(work.images[0].file),
      texts: workImageTexts({
        designer: currentDesigner,
        work,
        projects,
        smallText: (
          <Link to={workLink(currentDesigner.slug, work.slug)}>
            {work.title}{' '}
          </Link>
        ),
      }),
    }))

  const imagesByProject = projects.map(project => ({
    project,
    images: images.filter(
      image =>
        image.work.projects &&
        image.work.projects.map(p => p.slug).includes(project.slug)
    ),
  }))

  // include works w/o project
  imagesByProject.push({
    project: null,
    images: images.filter(
      image => !image.work.projects || image.work.projects.length === 0
    ),
  })

  const imageSets = imagesByProject
    .filter(item => item.images.length > 0)
    .map(({ project, images }) => ({
      title: project ? project.title : null,
      images,
    }))

  const hoverImageRenderer = hoverImage => (
    <WorkSummary work={hoverImage.work} />
  )

  const selectorItems = designers.map(item => ({
    title: item.name,
    link: designerLink(item.slug),
  }))

  const selectorSections = [{ items: selectorItems }]

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Designers — ${currentDesigner.name}`} />
      <LeftPane>
        <WorksHeader>Works</WorksHeader>
        <ImageList
          imageSets={imageSets}
          hoverImageRenderer={hoverImageRenderer}
        />
      </LeftPane>
      <RightPane className="selectable">
        <Header1>{currentDesigner.name}</Header1>
        <DesignerBio bio={currentDesigner.bio} />
        <DesignerProjects projects={projects} />
        <Press press={currentDesigner.press} />
        <HiddenSelector
          title="All Designers"
          sections={selectorSections}
          currentItemLink={designerLink(currentDesigner.slug)}
        />
      </RightPane>
    </PageContainer>
  )
}

export default DesignerTemplate

export const pageQuery = graphql`
  query DesignerTemplateQuery {
    allProjectsYaml {
      edges {
        node {
          slug
          title
          designers {
            slug
          }
        }
      }
    }
    allDesignersYaml(sort: { order: ASC, fields: [name] }) {
      edges {
        node {
          slug
          name
          bio
          press {
            title
            link
          }
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
            medium
            dimensions
          }
        }
      }
    }
  }
`
