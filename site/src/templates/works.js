import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import TagSelector from '../layouts/TagSelector'
import HoverInfo from '../layouts/HoverInfo'
import WorkSummary from '../layouts/WorkSummary'
import {
  workImagePath,
  workImageTexts,
  categoryTags,
  tagCategory,
} from '../util'

const { LeftPane, RightPane } = createPanes('320px')

export default class WorksTemplate extends Component {
  constructor(props) {
    super(props)

    this.imageHoverHandler = this.imageHoverHandler.bind(this)

    this.state = {
      hoverImage: null,
    }
  }

  imageHoverHandler(hoverImage) {
    this.setState({ hoverImage: hoverImage || null })
  }

  render() {
    const { data, pathContext } = this.props
    const { allProjectsYaml, allDesignersYaml } = data
    const { currentCategory } = pathContext
    const { hoverImage } = this.state

    const currentTags = categoryTags(currentCategory)

    const designers = allDesignersYaml.edges.map(edge => edge.node)
    const projects = allProjectsYaml.edges.map(edge => edge.node)
    const filterWork = p => {
      let tags = p.tags.concat(p.when)
      for (let i = 0; i < currentTags.length; i++) {
        if (tags.includes(currentTags[i])) {
          return true
        }
      }

      return false
    }

    let images = []
    const tagSet = new Set()
    designers.forEach(designer => {
      designer.works.forEach(work => {
        work.tags.forEach(t => tagSet.add(tagCategory(t)))

        if (filterWork(work)) {
          images.push({
            work,
            designer,
            src: workImagePath(work.images[0].file),
            texts: workImageTexts({
              designer,
              work,
              projects,
              smallText: true,
            }),
          })
        }
      })
    })

    // TODO: remove temporary image multiplication
    for (let i = 0; i < 3; i++) {
      images = images.concat(images)
    }

    const imageSets = [{ images }]
    const tags = Array.from(tagSet).sort(
      (a, b) =>
        Number(a) && Number(b) ? b.localeCompare(a) : a.localeCompare(b)
    )

    return (
      <PageContainer>
        <Helmet title={`Salon 94 Design - Works - ${currentCategory}`} />
        <LeftPane>
          <ImageList
            imageSets={imageSets}
            onImageHover={this.imageHoverHandler}
          />
        </LeftPane>
        <RightPane>
          <TagSelector tags={tags} currentTag={currentCategory} />
          {hoverImage && (
            <HoverInfo>
              <WorkSummary
                work={hoverImage.work}
                designer={hoverImage.designer}
              />
            </HoverInfo>
          )}
        </RightPane>
      </PageContainer>
    )
  }
}

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
            projects
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
