import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, monofont } from '../layouts/emotion-base'
import HiddenSelector from '../layouts/HiddenSelector'
import DesignerProjects from '../layouts/DesignerProjects'
import DesignerBio from '../layouts/DesignerBio'
import ImageList from '../layouts/ImageList'
import PieceSummary from '../layouts/PieceSummary'
import { pieceImagePath, pieceImageTexts, designerLink } from '../util'

const { LeftPane, RightPane } = createPanes('370px')

const WorksHeader = styled.h1`
  composes: ${sansfont};
  position: fixed;
  top: 20px;
  margin: 0;
  font-weight: 600;
  font-size: 56px;
`

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
    const { hoverImage } = this.state

    const designers = allDesignersYaml.edges.map(edge => edge.node)
    const currentDesigner = designers.find(d => d.slug === currentDesignerSlug)

    const projects = allProjectsYaml.edges
      .map(edge => edge.node)
      .filter(project => project.designers.includes(currentDesignerSlug))

    let images = []
    currentDesigner.pieces.forEach(piece => {
      images.push({
        piece,
        src: pieceImagePath(piece.images[0]),
        texts: pieceImageTexts({
          designer: currentDesigner,
          piece,
          projects,
        }),
      })
    })

    // TODO: remove image multiplication
    for (let i = 0; i < 3; i++) {
      images = images.concat(images)
    }

    const imagesByProject = projects.map(project => ({
      project,
      images: images.filter(image =>
        image.piece.projects.includes(project.slug)
      ),
    }))

    // include pieces w/o project
    imagesByProject.push({
      project: null,
      images: images.filter(image => image.piece.projects.length === 0),
    })

    let imageSets = imagesByProject
      .filter(item => item.images.length > 0)
      .map(({ project, images }) => ({
        title: project ? project.title : null,
        images,
      }))

    // TODO: remove image set multiplication
    for (let i = 0; i < 2; i++) {
      imageSets = imageSets.concat(imageSets.slice(0, 1))
    }

    const selectorItems = designers.map(item => ({
      title: item.name,
      link: designerLink(item.slug)
    }))

    // TODO: remove temporary selector multiplication
    for (let i = 3; i < 15; i++) {
      selectorItems.push({
        link: designerLink(`designer-${i}`),
        title: `Designer ${i}`,
      })
    }

    return (
      <PageContainer>
        <Helmet title={`Salon 94 Design - Designers — ${currentDesigner.name}`} />
        <LeftPane>
          <WorksHeader>{currentDesigner.name} - Works</WorksHeader>
          <ImageList
            imageSets={imageSets}
            onImageHover={this.imageHoverHandler}
          />
        </LeftPane>
        <RightPane style={{ marginTop: 12, marginRight: 24 }}>
          <DesignerProjects projects={projects} />
          <DesignerBio bio={currentDesigner.bio} />
          <HiddenSelector
            items={selectorItems}
            currentItemLink={designerLink(currentDesigner.slug)}
          />
          {hoverImage &&
            <PieceSummary
              piece={hoverImage.piece}
            />}
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
    allDesignersYaml(sort: { order: ASC, fields: [name] }) {
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
