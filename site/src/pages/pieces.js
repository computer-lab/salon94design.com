import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer, createPanes } from '../layouts/containers'
import { sansfont, monofont, breakpoint1 } from '../layouts/emotion-base'
import TagSelector from '../layouts/TagSelector'

const { LeftPane, RightPane } = createPanes('470px')

const Instructions = styled.div`
  composes: ${sansfont};
  font-size: 42px;
  line-height: 1.2;

  @media (${breakpoint1}) {
    margin: 40px 0;
  }
`

export default function Pieces({ data }) {
  const { allDesignersYaml } = data

  const tagSet = new Set()
  const designers = allDesignersYaml.edges.map(edge => edge.node)
  designers.forEach(designer => {
    designer.pieces.forEach(piece => {
      piece.tags.forEach(t => tagSet.add(t))
      tagSet.add(piece.when)
    })
  })

  const tags = Array.from(tagSet).sort()

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Pieces`} />
      <LeftPane>
        <Instructions>Select a category to view pieces.</Instructions>
      </LeftPane>
      <RightPane>
        <TagSelector tags={tags} />
      </RightPane>
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query PiecesQuery {
    allDesignersYaml {
      edges {
        node {
          slug
          name
          pieces {
            slug
            title
            when
            tags
            images
          }
        }
      }
    }
  }
`
