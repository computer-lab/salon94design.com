import React, { Component } from 'react'
import Helmet from '../components/helmet'
import Link, { navigateTo } from 'gatsby-link'
import styled from 'emotion/react'

import { PageContainer } from '../layouts/containers'
import SectionItemList from '../components/SectionItemList'
import { chooseDesignerImage, designerLink } from '../util'

export default class Designers extends Component {
  componentDidMount() {
    navigateTo('/')
  }

  render() {
    const { allDesignersYaml } = this.props.data

    const designers = allDesignersYaml.edges.map(edge => edge.node)

    const listItems = designers.map(designer => {
      return {
        title: designer.title,
        image: chooseDesignerImage(designer),
        link: designerLink(designer.slug),
      }
    })

    return (
      <PageContainer>
        <Helmet
          title={`Salon 94 Design - Designers`}
          description={`List of designers represented by Salon 94 Design.`}
        />
        <div>
          <SectionItemList items={listItems} />
        </div>
      </PageContainer>
    )
  }
}

export const pageQuery = graphql`
  query DesignersQuery {
    allDesignersYaml(sort: { order: ASC, fields: [title] }) {
      edges {
        node {
          slug
          title
          ...baseWorkFields
        }
      }
    }
  }
`
