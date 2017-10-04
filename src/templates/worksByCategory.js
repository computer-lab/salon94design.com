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
  getAllTags,
} from '../util'

const { LeftPane, RightPane } = createPanes('370px')

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
    const filterWork = w => {
      if (!w.images || w.images.length === 0) {
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
      })
    })

    const imageSets = [{ images }]

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
