import React from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont } from '../layouts/emotion-base'
import ImageList from '../components/ImageList'
import TagSelector from '../components/TagSelector'
import WorkSummary from '../components/WorkSummary'
import {
  imageInfo,
  workImageTexts,
  workLink,
  designerLink,
  getAllTags,
  byLastName,
} from '../util'

const { LeftPane, RightPane } = createPanes('195px')

const WorksTemplate = ({ data, pathContext }) => {
  const { allProjectsYaml, allDesignersYaml } = data
  const { tag } = pathContext

  // Technically this can be `const` but that's a lie right ;p
  let designers = allDesignersYaml.edges.map(edge => edge.node)
  designers.sort(byLastName)

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  const filterWork = w => {
    if (!w.hydratedImages || w.hydratedImages.length === 0) {
      return false
    }

    let tags = (w.tags || []).concat(w.when)
    return tags.indexOf(tag) !== -1
  }

  const tags = getAllTags(designers)

  const images = []
  designers.forEach(designer => {
    const works = (designer.works || []).filter(filterWork)
    works.forEach(work => {
      const image = work.hydratedImages.length > 0 && work.hydratedImages[0]
      if (image) {
        images.push(
          Object.assign(imageInfo(image), {
            work,
            designer,
            texts: workImageTexts({
              designer,
              work,
              projects,
              smallText: (
                <div>
                  <Link to={workLink(designer.slug, work.slug)}>
                    {work.title}, {work.when}{' '}
                  </Link>
                  -{' '}
                  <Link to={designerLink(designer.slug)}>{designer.title}</Link>
                </div>
              ),
            }),
          })
        )
      }
    })
  })

  const imageSets = [{ images }]

  const hoverImageRenderer = hoverImage => (
    <WorkSummary work={hoverImage.work} designer={hoverImage.designer} />
  )

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Works - ${tag}`} />
      <LeftPane>
        <ImageList
          imageSets={imageSets}
          hoverImageRenderer={hoverImageRenderer}
        />
      </LeftPane>
      <RightPane>
        <TagSelector
          allTags={tags}
          currentTag={tag}
        />
      </RightPane>
    </PageContainer>
  )
}

export default WorksTemplate

export const pageQuery = graphql`
  query WorksTemplateQuery {
    allProjectsYaml {
      ...linkProjectEdges
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
