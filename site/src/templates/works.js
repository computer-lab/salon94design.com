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
import { workImagePath, workImageTexts } from '../util'

const { LeftPane, RightPane } = createPanes()

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
    const { currentTag } = pathContext
    const { hoverImage } = this.state

    const designers = allDesignersYaml.edges.map(edge => edge.node)
    const projects = allProjectsYaml.edges.map(edge => edge.node)
    const filterWork = p =>
      p.tags.includes(currentTag) || p.when === currentTag

    let images = []
    const tagSet = new Set()
    designers.forEach(designer => {
      designer.works.forEach(work => {
        work.tags.forEach(t => tagSet.add(t))
        tagSet.add(work.when)

        if (filterWork(work)) {
          images.push({
            work,
            designer,
            src: workImagePath(work.images[0]),
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
        <Helmet title={`Salon 94 Design - Works - ${currentTag}`} />
        <LeftPane>
          <ImageList
            imageSets={imageSets}
            onImageHover={this.imageHoverHandler}
          />
        </LeftPane>
        <RightPane>
          <TagSelector tags={tags} currentTag={currentTag} />
          {hoverImage &&
            <HoverInfo>
              <WorkSummary
                work={hoverImage.work}
                designer={hoverImage.designer}
              />
            </HoverInfo>}
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
            images
            caption
            price
          }
        }
      }
    }
  }
`
