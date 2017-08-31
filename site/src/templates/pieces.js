import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont, childLink } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
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

    const images = []
    designers.forEach(designer => {
      designer.pieces
        .filter(p => p.tags.includes(currentTag) || p.when === currentTag)
        .forEach(piece => {
          images.push({
            piece,
            designer,
            src: pieceImagePath(piece.images[0]),
            texts: pieceImageTexts({
              designer,
              piece,
              projects,
            })
          })
        })
    })

    const imageSets = [{ images }]

    return (
      <PageContainer>
        <Helmet title={`Salon 94 Design - Pieces - ${currentTag}`} />
        <LeftPane>
          <ImageList
            imageSets={imageSets}
            onImageHover={this.imageHoverHandler}
          />
        </LeftPane>
        <RightPane>
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
