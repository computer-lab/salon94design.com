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
  const { allProjectsYaml, allDesignersYaml } = data
  const { designerSlug, workSlug } = pathContext

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const currentDesigner = designers.find(d => d.slug === designerSlug)
  const works = currentDesigner.works
  const currentWork = works.find(p => p.slug === workSlug)

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  const images = (currentWork.hydratedImages || [])
    .filter(i => !!i)
    .map(image => imageInfo(image))
  const imageSets = [{ images }]

  const selectorItems = works
    .map(work => ({
      title: `${work.title}, ${work.when}`,
      link: workLink(currentDesigner.slug, work.slug),
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  const selectorSections = [{ items: selectorItems }]

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - ${currentWork.title}, ${currentDesigner.title}`}
      />
      <LeftPane>
        {currentWork.video && <Video video={currentWork.video} />}
        <ImageList imageSets={imageSets} alwaysExpand={true} />
      </LeftPane>
      <RightPane className="selectable">
        <WorkSummary
          work={currentWork}
          designer={currentDesigner}
          projects={projects}
          detailed={true}
        />
        <HiddenSelector
          title={`All Works by ${currentDesigner.title}`}
          sections={selectorSections}
          currentItemLink={workLink(currentDesigner.slug, currentWork.slug)}
        />
      </RightPane>
    </PageContainer>
  )
}

export default WorkTemplate

export const pageQuery = graphql`
  query WorkTemplateQuery {
    allProjectsYaml {
      edges {
        node {
          slug
          title
          type
        }
      }
    }
    allDesignersYaml {
      edges {
        node {
          slug
          title
          ...fullWorkFields
        }
      }
    }
  }
`
