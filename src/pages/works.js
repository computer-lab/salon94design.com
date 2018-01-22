import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { sansfont, breakpoint1, CenterContainer } from '../layouts/emotion-base'
import TagSelector from '../components/TagSelector'
import SectionItemList from '../components/SectionItemList'
import {
  capitalize,
  getAllTags,
  workTagLink,
} from '../util'

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

  const listItems = tags.map(tag => ({
    title: capitalize(tag),
    link: workTagLink(tag)
  }))

  return (
    <div>
      <Helmet
        title={`Salon 94 Design - Works by Category`}
        description={`Filter works by tagged categories.`}
      />
      <CenterContainer>
        <SectionItemList centered items={listItems} disableColumns={true} />
      </CenterContainer>
    </div>
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
