import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import HiddenSelector from '../layouts/HiddenSelector'
import PieceSummary from '../layouts/PieceSummary'
import { pieceImagePath, pieceLink } from '../util'

const { LeftPane, RightPane } = createPanes()

const PieceTemplate = ({ data, pathContext }) => {
  const { allProjectsYaml, allDesignersYaml } = data
  const { designerSlug, pieceSlug } = pathContext

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const currentDesigner = designers.find(d => d.slug === designerSlug)
  const pieces = currentDesigner.pieces
  const currentPiece = pieces.find(p => p.slug === pieceSlug)

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  let images = currentPiece.images.map(src => ({
    src: pieceImagePath(src),
  }))

  // TODO: remove temporary image multiplication
  for (let i = 0; i < 1; i++) {
    images = images.concat(images)
  }

  const imageSets = [{ images }]

  const selectorItems = pieces.map(piece => ({
    title: piece.title,
    link: pieceLink(currentDesigner.slug, piece.slug),
  }))

  const selectorSections = [{ items: selectorItems }]

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - ${currentDesigner.name} Pieces - ${currentPiece.title}`}
      />
      <LeftPane>
        <ImageList imageSets={imageSets} alwaysExpand={true} />
      </LeftPane>
      <RightPane className="selectable">
        <PieceSummary
          piece={currentPiece}
          designer={currentDesigner}
          projects={projects}
          detailed={true}
        />
        <HiddenSelector
          title={`All Pieces by ${currentDesigner.name}`}
          sections={selectorSections}
          currentItemLink={pieceLink(currentDesigner.slug, currentPiece.slug)}
        />
      </RightPane>
    </PageContainer>
  )
}

export default PieceTemplate

export const pageQuery = graphql`
  query PieceTemplateQuery {
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
