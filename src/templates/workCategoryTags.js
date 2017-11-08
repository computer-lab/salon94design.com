import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer, createPanes } from '../layouts/containers'
import { sansfont, breakpoint1 } from '../layouts/emotion-base'
import TagSelector from '../components/TagSelector'
import SectionItemList from '../components/SectionItemList'
import {
  capitalize,
  getCategoryTags,
  chooseTagImage,
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

export default function WorkCategoryTags({ data, pathContext }) {
  const { allDesignersYaml } = data
  const { category } = pathContext

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const works = designers.reduce((items, d) => items.concat(d.works || []), [])

  const tags = getCategoryTags(designers, category)
  const listItems = tags.map(tag => ({
    title: capitalize(tag),
    link: workTagLink(tag),
    image: chooseTagImage(works, tag),
  }))

  const title = capitalize(category)

  const listSections = [
    {
      title: `${title} Categories`,
      items: listItems,
    },
  ]

  return (
    <PageContainer>
      <Helmet
        title={`Salon 94 Design - Works by Category - ${title}`}
        description={`Filter ${category} works by tags.`}
      />
      <div>
        <SectionItemList sections={listSections} fullWidthMobile={false} />
      </div>
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query WorksCategoryTagsQuery {
    allDesignersYaml {
      edges {
        node {
          works {
            when
            tags
            hero
            ...baseHydratedImages
          }
        }
      }
    }
  }
`
