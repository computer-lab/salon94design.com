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

export default function Works({ data }) {
  const { allDesignersYaml } = data

  const tagSet = new Set()
  const designers = allDesignersYaml.edges.map(edge => edge.node)
  designers.forEach(designer => {
    designer.works.forEach(work => {
      work.tags.forEach(t => tagSet.add(t))
      tagSet.add(work.when)
    })
  })

  const tags = Array.from(tagSet).sort(
    (a, b) => (Number(a) && Number(b) ? b.localeCompare(a) : a.localeCompare(b))
  )

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Works`} />
      <LeftPane>
        <Instructions>Select a category to view works.</Instructions>
      </LeftPane>
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
          slug
          name
          works {
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
