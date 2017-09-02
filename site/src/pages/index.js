import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import ImageList from '../layouts/ImageList'
import Logo from '../layouts/logo'
import { pieceImagePath, pieceLink } from '../util'

const logoPosition = css`
  position: fixed;
  top: 92px;
  z-index: -1;
`

const IndexPage = ({ data }) => {
  const { allProjectsYaml, allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const currentProject = projects[0]
  const filterPiece = p => p.projects.includes(currentProject.slug)

  let images = []
  designers.forEach(designer => {
    designer.pieces.filter(filterPiece).forEach(piece => {
      piece.images.forEach(src => {
        images.push({
          src: pieceImagePath(src),
          unexpandedLink: pieceLink(designer.slug, piece.slug),
        })
      })
    })
  })

  // TODO: remove temporary image multiplication
  for (let i = 0; i < 5; i++) {
    images = images.concat(images)
  }

  // randomize image order
  images.sort(() => Math.random() - 0.5)

  const imageSets = [{ images }]

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design`} />
      <div style={{ paddingTop: 92 }}>
        <Logo width={300} className={logoPosition} />
        <ImageList imageSets={imageSets} unexpandable={true} />
      </div>
    </PageContainer>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query LandingPageQuery {
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
