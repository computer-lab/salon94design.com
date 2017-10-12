import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer, createPanes } from '../layouts/containers'
import { sansfont, monofont, breakpoint1 } from '../layouts/emotion-base'
import TagSelector from '../layouts/TagSelector'
import { getAllTags } from '../util'

const { LeftPane, RightPane } = createPanes('370px')

const Instructions = styled.div`
  composes: ${sansfont};
  font-size: 42px;
  line-height: 1.2;

  @media (${breakpoint1}) {
    margin: 40px 0;
  }
`

export default function Works({ data }) {
  const { allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const tags = getAllTags(designers)

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Works by Category`} />
      <LeftPane />
      <RightPane>
        <TagSelector tags={tags} />
      </RightPane>
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query WorksQuery {
    allDesignersYaml {
      edges {
        node {
          works {
            when
            tags
          }
        }
      }
    }
  }
`
