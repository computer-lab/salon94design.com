import React from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'

import { createPanes, PageContainer } from '../layouts/containers'
import {
  sansfont,
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
import {
  SHOW_SELECTORS,
  imageInfo,
  workImageTexts,
  designerLink,
  workLink,
} from '../util'

const { LeftPane, RightPane } = createPanes()

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
  const { designer, allProjectsYaml, allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  const projects = allProjectsYaml.edges
    .map(edge => edge.node)
    .filter(project =>
      (project.designers || [])
        .map(designer => designer.slug)
        .indexOf(designer.slug) !== -1
    )

  const works = designer.works || []
  const images = works
    .filter(
      work =>
        work.hydratedImages &&
        work.hydratedImages.length > 0 &&
        work.hydratedImages[0]
    )
    .map(work =>
      Object.assign(imageInfo(work.hydratedImages[0]), {
        work,
        texts: workImageTexts({
          designer,
          work,
          projects,
          includeDesigner: false,
          smallText: (
            <Link to={workLink(designer.slug, work.slug)}>
              {work.title}, {work.when}
            </Link>
          ),
        }),
      })
    )

  // Reverse-when work image sort
  images.sort((a, b) => -1 * a.work.when.localeCompare(b.work.when));

  const allImages = [{
    project: null,
    images
  }];

  const imageSets = allImages
    .filter(item => item.images.length > 0)
    .map(({ project, images }, idx) => ({
      title: idx !== 0 && project ? project.title : null,
      images,
    }))

  const hoverImageRenderer = hoverImage => (
    <WorkSummary work={hoverImage.work} />
  )

  const selectorItems = designers.map(item => ({
    title: item.title,
    link: designerLink(item.slug),
  }))

  const selectorSections = [{ items: selectorItems }]

  const statusClass = cx({
    available: designer.status === 'Available',
    represented: designer.status === 'Represented',
  })

  return (
    <PageContainer>
      <Helmet
        title={`${designer.title} - Salon 94 Design`}
        description={`Exhibitions, projects and works by ${designer.title}. ${designer.bio}`}
      />
      <LeftPane>
        <WorksHeader>Works</WorksHeader>
        <ImageList
          imageSets={imageSets}
          hoverImageRenderer={hoverImageRenderer}
        />
      </LeftPane>
      <RightPane>
        <Header1>{designer.title}</Header1>
        <DesignerBio bioHtml={designer.bioHtml} />
        <DesignerProjects projects={projects} />
        <Press press={designer.press} />
        {SHOW_SELECTORS && (
          <HiddenSelector
            title="All Designers"
            sections={selectorSections}
            currentItemLink={designerLink(designer.slug)}
          />
        )}
      </RightPane>
    </PageContainer>
  )
}

export default DesignerTemplate

export const pageQuery = graphql`
  query DesignerTemplateQuery($slug: String!) {
    designer: designersYaml(slug: { eq: $slug }) {
      slug
      title
      status
      bio
      bioHtml
      press {
        title
        link
        file
      }
      ...fullWorkFields
    }
    allProjectsYaml(sort: { order: ASC, fields: [title] }) {
      ...linkProjectEdges
    }
    allDesignersYaml(sort: { order: ASC, fields: [title] }) {
      ...linkDesignerEdges
    }
  }
`
