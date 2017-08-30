import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import {
  createPanes,
  PageContainer,
} from '../layouts/containers'
import { sansfont, monofont, childLink } from '../layouts/emotion-base'
import DesignerSelector from '../layouts/DesignerSelector'
import DesignerProjects from '../layouts/DesignerProjects'
import DesignerBio from '../layouts/DesignerBio'
import ImageList from '../layouts/ImageList'
import { pieceImagePath, designerLink, pieceLink } from '../util'

const { LeftPane, RightPane } = createPanes()

export default class DesignerTemplate extends Component {
  constructor(props) {
    super(props)

    this.imageHoverHandler = this.imageHoverHandler.bind(this)

    this.state = {
      hoverImage: null,
    }
  }

  imageHoverHandler(hoverImage) {
    this.setState({ hoverImage: hoverImage || null })
  }

  render() {
    const { data, pathContext } = this.props
    const { allProjectsYaml, allDesignersYaml } = data
    const { slug: currentDesignerSlug } = pathContext

    const designers = allDesignersYaml.edges.map(edge => edge.node)
    const currentDesigner = designers.find(d => d.slug === currentDesignerSlug)

    const projects = allProjectsYaml.edges.map(edge => edge.node)
      .filter(project => project.designers.includes(currentDesignerSlug))

    return (
      <PageContainer>
        <Helmet title={`Salon 94 Design - Designers`} />
        <LeftPane>
          Hello
        </LeftPane>
        <RightPane style={{marginTop: 12}}>
          <DesignerProjects projects={projects} />
          <DesignerBio bio={currentDesigner.bio} />
          <DesignerSelector
            designers={designers}
            currentDesignerSlug={currentDesignerSlug}
          />
        </RightPane>
      </PageContainer>
    )
  }
}

export const pageQuery = graphql`
  query DesignerTemplateQuery {
    allProjectsYaml {
      edges {
        node {
          slug
          title
          designers
        }
      }
    }
    allDesignersYaml(
      sort: { order: ASC, fields: [name] }
    ) {
      edges {
        node {
          slug
          name
          bio
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
