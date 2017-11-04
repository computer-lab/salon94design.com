import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import Video from '../layouts/Video'
import HiddenSelector from '../layouts/HiddenSelector'
import WorkSummary from '../layouts/WorkSummary'
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

  const images = (currentWork.hydratedImages || []).map(image =>
    imageInfo(image)
  )
  const imageSets = [{ images }]

  const selectorItems = works.map(work => ({
    title: work.title,
    link: workLink(currentDesigner.slug, work.slug),
  }))

  const selectorSections = [{ items: selectorItems }]

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - ${currentWork.title}, ${currentDesigner.name}`}
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
          title={`All Works by ${currentDesigner.name}`}
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
          name
          works {
            slug
            title
            when
            projects {
              slug
            }
            tags
            video {
              vimeoId
              caption
            }
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
          }
        }
      }
    }
  }
`
