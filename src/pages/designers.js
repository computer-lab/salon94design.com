import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import SectionItemList from '../components/SectionItemList'
import { chooseDesignerImage, designerLink, byLastName } from '../util'
import { CenterContainer } from '../layouts/emotion-base'

const prefferedStatusOrder = ['Represented', 'Available']

export default function Designers({ data }) {
  const { allDesignersYaml } = data

  // Technically this can be `const` but that's a lie right ;p
  let designers = allDesignersYaml.edges.map(edge => edge.node)
  designers.sort(byLastName)

/*
  XXX : Removing this for demo - need to come up with a way to style this

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
      // description: designer.bioHtml,
      link: designerLink(designer.slug),
    }))

    const title = status === 'Represented' ? null : 'Also Available'

    return { title, items }
  })
*/
  const listSections = [{
    title: null,
    items: designers.map(designer => ({ title: designer.title, link: designerLink(designer.slug)}))
  }];

  return (
    <div>
      <Helmet
        title={`Salon 94 Design - Designers`}
        description={`List of designers represented by Salon 94 Design.`}
      />
      <CenterContainer>
        <SectionItemList centered sections={listSections} disableColumns={true} />
      </CenterContainer>
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
          bioHtml
        }
      }
    }
  }
`
