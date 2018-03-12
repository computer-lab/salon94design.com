import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont } from '../layouts/emotion-base'
import ImageList from '../components/ImageList'
import Video from '../components/Video'
import HiddenSelector from '../components/HiddenSelector'
import WorkSummary from '../components/WorkSummary'
import { imageInfo, workLink } from '../util'

const { LeftPane, RightPane } = createPanes()

const WorkTemplate = ({ data, pathContext }) => {
  const { designer, allProjectsYaml } = data
  const { workSlug } = pathContext

  const works = designer.works || []
  const currentWork = works.find(p => p.slug === workSlug)

  const projects = allProjectsYaml
    ? allProjectsYaml.edges.map(edge => edge.node)
    : []

  const images = (currentWork.hydratedImages || [])
    .filter(i => !!i)
    .map(image => imageInfo(image))
  const imageSets = [{ images }]

  const selectorItems = works
    .filter(work => !!work.title)
    .map(work => ({
      title: work.when ? `${work.title}, ${work.when}` : work.title,
      link: workLink(designer.slug, work.slug),
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  const selectorSections = [{ items: selectorItems }]

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - ${currentWork.title}, ${designer.title}`}
      />
      <LeftPane>
        {currentWork.video && <Video video={currentWork.video} />}
        <ImageList imageSets={imageSets} alwaysExpand={true} />
      </LeftPane>
      <RightPane className="selectable">
        <WorkSummary
          work={currentWork}
          designer={designer}
          projects={projects}
          detailed={true}
        />
        <HiddenSelector
          title={`All Works by ${designer.title}`}
          sections={selectorSections}
          currentItemLink={workLink(designer.slug, currentWork.slug)}
        />
      </RightPane>
    </PageContainer>
  )
}

export default WorkTemplate

export const pageQuery = graphql`
  query WorkTemplateQuery($designerSlug: String!, $projectsRegex: String!) {
    allProjectsYaml(filter: { slug: { regex: $projectsRegex } }) {
      ...linkProjectEdges
    }
    designer: designersYaml(slug: { eq: $designerSlug }) {
      slug
      title
      ...fullWorkFields
    }
  }
`
