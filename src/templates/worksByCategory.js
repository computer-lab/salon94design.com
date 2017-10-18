import React from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import TagSelector from '../layouts/TagSelector'
import WorkSummary from '../layouts/WorkSummary'
import {
  imageInfo,
  workImageTexts,
  workLink,
  designerLink,
  categoryTags,
  getAllTags,
} from '../util'

const { LeftPane, RightPane } = createPanes('370px')

const WorksTemplate = ({ data, pathContext }) => {
  const { allProjectsYaml, allDesignersYaml } = data
  const { currentCategory } = pathContext

  const currentTags = categoryTags(currentCategory)

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const filterWork = w => {
    if (!w.hydratedImages || w.hydratedImages.length === 0) {
      return false
    }

    let tags = (w.tags || []).concat(w.when)
    for (let i = 0; i < currentTags.length; i++) {
      if (tags.includes(currentTags[i])) {
        return true
      }
    }

    return false
  }

  const tags = getAllTags(designers)

  const images = []
  designers.forEach(designer => {
    const works = (designer.works || []).filter(filterWork)
    works.forEach(work => {
      const image = work.hydratedImages[0]
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
                  {work.title}{' '}
                </Link>
                – <Link to={designerLink(designer.slug)}>{designer.name}</Link>
                , {work.when}
              </div>
            ),
          }),
        })
      )
    })
  })

  const imageSets = [{ images }]

  const hoverImageRenderer = hoverImage => (
    <WorkSummary work={hoverImage.work} designer={hoverImage.designer} />
  )

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Works - ${currentCategory}`} />
      <LeftPane>
        <ImageList
          imageSets={imageSets}
          hoverImageRenderer={hoverImageRenderer}
        />
      </LeftPane>
      <RightPane>
        <TagSelector tags={tags} currentTag={currentCategory} />
      </RightPane>
    </PageContainer>
  )
}

export default WorksTemplate

export const pageQuery = graphql`
  query WorksTemplateQuery {
    allProjectsYaml {
      edges {
        node {
          slug
          title
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
