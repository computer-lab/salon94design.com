import React from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'

import { createPanes, PageContainer } from '../layouts/containers'
import {
  sansfont,
  monofont,
  Header1,
  breakpoint1,
  breakpoint2,
  breakpoint3,
} from '../layouts/emotion-base'
import HiddenSelector from '../components/HiddenSelector'
import DesignerBio from '../components/DesignerBio'
import DesignerProjects from '../components/DesignerProjects'
import Press from '../components/Press'
import ImageList from '../components/ImageList'
import WorkSummary from '../components/WorkSummary'
import { SHOW_SELECTORS, imageInfo, workImageTexts, designerLink, workLink } from '../util'

const { LeftPane, RightPane } = createPanes('370px')

const WorksHeader = styled.h2`
  composes: ${sansfont};
  margin: 0 0 28px 0;
  padding: 0;
  font-weight: 500;
  font-size: 36px;

  @media (${breakpoint1}) {
    margin: 15px 0 28px 0;
    font-size: 24px;
  }
`

const StatusTagWrapper = styled.div`
  margin: -32px 0 32px 0;

  @media (${breakpoint1}) {
    margin: -26px 0 28px 0;
  }

  @media (${breakpoint3}) {
    margin: -30px 0 28px 0;
  }
`

const StatusTag = styled.div`
  composes: ${monofont};
  display: inline-block;
  padding: 5px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.available {
    background: linear-gradient(to right, #eee, #fafafa);
  }

  &.represented {
    background: linear-gradient(to right, #33f, #eef);
  }

  @media (${breakpoint3}) {
    font-size: 13px;
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
    .filter(work => work.hydratedImages && work.hydratedImages.length > 0)
    .map(work =>
      Object.assign(imageInfo(work.hydratedImages[0]), {
        work,
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
      })
    )

  const imagesByProject = projects.map(project => ({
    project,
    images: images.filter(
      image =>
        image.work.projects &&
        image.work.projects.map(p => p.slug).includes(project.slug)
    ),
  }))

  // include works w/o project
  const projectSlugs = projects.map(p => p.slug)
  imagesByProject.splice(0, 0, {
    project: null,
    images: images.filter(
      image =>
        !image.work.projects ||
        !image.work.projects.find(p => projectSlugs.includes(p.slug))
    ),
  })

  const imageSets = imagesByProject
    .filter(item => item.images.length > 0)
    .map(({ project, images }, idx) => ({
      title: idx !== 0 && project ? project.title : null,
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

  const statusClass = cx({
    available: currentDesigner.status === 'Available',
    represented: currentDesigner.status === 'Represented',
  })

  return (
    <PageContainer>
      <Helmet
        title={`${currentDesigner.name} - Salon 94 Design`}
        description={`Exhibitions, projects and works by ${currentDesigner.name}. ${currentDesigner.bio}`}
      />
      <LeftPane>
        <WorksHeader>Works</WorksHeader>
        <ImageList
          imageSets={imageSets}
          hoverImageRenderer={hoverImageRenderer}
        />
      </LeftPane>
      <RightPane className="selectable">
        <Header1>{currentDesigner.name}</Header1>
        <DesignerBio bioHtml={currentDesigner.bioHtml} />
        <DesignerProjects projects={projects} />
        <Press press={currentDesigner.press} />
          {SHOW_SELECTORS &&
            <HiddenSelector
              title="All Designers"
              sections={selectorSections}
              currentItemLink={designerLink(currentDesigner.slug)}
            />
          }
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
          type
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
          status
          bio
          bioHtml
          press {
            title
            link
            file
          }
          works {
            slug
            title
            when
            projects {
              slug
            }
            tags
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
