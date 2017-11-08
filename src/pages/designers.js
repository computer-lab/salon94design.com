import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import SectionItemList from '../components/SectionItemList'
import { chooseDesignerImage, designerLink, byLastName } from '../util'

const prefferedStatusOrder = ['Represented', 'Available']

export default function Designers({ data }) {
  const { allDesignersYaml } = data

  // Technically this can be `const` but that's a lie right ;p
  let designers = allDesignersYaml.edges.map(edge => edge.node)
  designers.sort(byLastName)

  const designersByStatus = {}
  designers.forEach(d => {
    if (!designersByStatus[d.status]) {
      designersByStatus[d.status] = [d]
    } else {
      designersByStatus[d.status].push(d)
    }
  })

  const sortedStatuses = Object.keys(designersByStatus).sort(
    (a, b) => prefferedStatusOrder.indexOf(a) - prefferedStatusOrder.indexOf(b)
  )

  const listSections = sortedStatuses.map(status => {
    const items = designersByStatus[status].map(designer => ({
      title: designer.title,
      image: chooseDesignerImage(designer),
      link: designerLink(designer.slug),
    }))

    const title = status === 'Represented' ? null : 'Also Available'

    return { title, items }
  })

  return (
    <div>
      <Helmet
        title={`Salon 94 Design - Designers`}
        description={`List of designers represented by Salon 94 Design.`}
      />
      <div>
        <SectionItemList title="Designers" sections={listSections} />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query DesignersQuery {
    allDesignersYaml(sort: { order: ASC, fields: [title] }) {
      edges {
        node {
          slug
          title
          status
          ...baseWorkFields
        }
      }
    }
  }
`
