import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { sansfont, breakpoint1 } from '../layouts/emotion-base'
import TagSelector from '../components/TagSelector'
import SectionItemList from '../components/SectionItemList'
import {
  capitalize,
  categories,
  getCategoryTags,
  chooseCategoryImage,
  categoryLink,
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
  const works = designers.reduce((items, d) => items.concat(d.works || []), [])

  const listItems = categories.map(category => ({
    title: capitalize(category),

    // if only 1 tag, skip straight to tag page
    link:
      getCategoryTags(designers, category).length > 1
        ? categoryLink(category)
        : workTagLink(category),
  }))

  return (
    <div>
      <Helmet
        title={`Salon 94 Design - Works by Category`}
        description={`Filter works by tagged categories.`}
      />
      <div>
        <SectionItemList items={listItems} disableColumns={true} />
      </div>
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
            hero
          }
        }
      }
    }
  }
`
