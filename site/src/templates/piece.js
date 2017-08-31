import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import PieceSummary from '../layouts/PieceSummary'
import { pieceImagePath, pieceImageTexts } from '../util'

const { LeftPane, RightPane } = createPanes()

const PieceTemplate = ({ data, pathContext}) => {
  const { allProjectsYaml, allDesignersYaml } = data
  const { designerSlug, pieceSlug } = pathContext

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const currentDesigner = designers.find(d => d.slug === designerSlug)
  const pieces = currentDesigner.pieces
  const currentPiece = pieces.find(p => p.slug === pieceSlug)

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  let images = currentPiece.images.map(src => ({
    src: pieceImagePath(src)
  }))

  // TODO: remove temporary image multiplication
  for (let i = 0; i < 1; i++) {
    images = images.concat(images)
  }

  const imageSets = [{ images }]

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - ${currentDesigner.name} Pieces - ${currentPiece.title}`} />
      <LeftPane style={{marginTop: -86}}>
        <ImageList
          imageSets={imageSets}
          alwaysExpand={true}
        />
      </LeftPane>
      <RightPane>
        <PieceSummary
          piece={currentPiece}
          designer={currentDesigner}
          projects={projects}
          detailed={true}
        />
      </RightPane>
    </PageContainer>
  )
};

export default PieceTemplate;

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
