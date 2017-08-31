import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont, childLink } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import TagSelector from '../layouts/TagSelector'
import PieceSummary from '../layouts/PieceSummary'
import { pieceImagePath, pieceImageTexts } from '../util'

const { LeftPane, RightPane } = createPanes()

export default class PiecesTemplate extends Component {
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
    const filterPiece = p => (p.tags.includes(currentTag) || p.when === currentTag)

    let images = []
    const tagSet = new Set()
    designers.forEach(designer => {
      designer.pieces.forEach(piece => {
        piece.tags.forEach(t => tagSet.add(t))
        tagSet.add(piece.when)

        if (filterPiece(piece)) {
          images.push({
            piece,
            designer,
            src: pieceImagePath(piece.images[0]),
            texts: pieceImageTexts({
              designer,
              piece,
              projects,
              smallText: true
            })
          })
        }
      })
    })

    // TODO: remove temporary image multiplication
    for (let i = 0; i < 3; i++) {
      images = images.concat(images)
    }

    const imageSets = [{ images }]
    const tags = Array.from(tagSet).sort()

    // TODO: remove temporary tag multiplication
    for (let i = 4; i < 13; i++) {
      tags.push(`Tag ${i}`);
    }

    return (
      <PageContainer>
        <Helmet title={`Salon 94 Design - Pieces - ${currentTag}`} />
        <LeftPane style={{marginTop: -86}}>
          <ImageList
            imageSets={imageSets}
            onImageHover={this.imageHoverHandler}
          />
        </LeftPane>
        <RightPane>
          <TagSelector tags={tags} currentTag={currentTag} />
          {hoverImage &&
            <PieceSummary
              piece={hoverImage.piece}
              designer={hoverImage.designer}
            />}
        </RightPane>
      </PageContainer>
    )
  }
}

export const pageQuery = graphql`
  query PiecesTemplateQuery {
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
          pieces {
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
