import React, { Component } from 'react'
import Helmet from 'react-helmet'
import styled from 'emotion/react'
import { PageContainer } from '../layouts/containers'
import ImageList from '../layouts/ImageList'
import ProjectSelector from '../layouts/ProjectSelector'
import PieceSummary from '../layouts/PieceSummary'
import { pieceImagePath } from '../util'

const LeftPane = styled.div`
  width: calc(100% - 360px);
  height: 100%;
`

const RightPane = styled.div`
  width: 360px;
  position: fixed;
  right: 24px;
`

export default class ProjectTemplate extends Component {
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
    const { slug: currentProjectSlug } = pathContext
    const { hoverImage } = this.state

    const projects = allProjectsYaml.edges.map(edge => edge.node)
    const designers = allDesignersYaml.edges.map(edge => edge.node)
    const projectSlugs = new Set(projects.map(p => p.slug))

    const pieceImages = []
    designers.forEach(designer => {
      const pieces = designer.pieces.filter(piece =>
        piece.projects.includes(currentProjectSlug)
      )

      pieces.forEach(piece => {
        piece.images.forEach((src, i) => {
          const leftText = piece.caption
            ? `${piece.title}\n${piece.caption}`
            : piece.title
          pieceImages.push({
            piece,
            designer,
            src: pieceImagePath(src),
            linkPath: `/designers/${designer.slug}/${piece.slug}`,
            leftText: i === 0 && leftText,
            rightText: i === 0 && piece.price,
          })
        })
      })
    })

    const images = []
    for (let i = 0; i < 10; i++) {
      // TODO: remove temporary image multiplication
      pieceImages.forEach(item => images.push(item))
    }

    return (
      <PageContainer>
        <Helmet title={`Salon 94 Design - Projects`} />
        <LeftPane>
          <ImageList images={images} onImageHover={this.imageHoverHandler} />
        </LeftPane>
        <RightPane>
          <ProjectSelector
            projects={projects}
            currentProjectSlug={currentProjectSlug}
          />
          {hoverImage &&
            <PieceSummary
              piece={hoverImage.piece}
              designer={hoverImage.designer}
            />}
        </RightPane>
      </PageContainer>
    )
  }
}

export const pageQuery = graphql`
  query ProjectsTemplateQuery {
    allProjectsYaml {
      edges {
        node {
          slug
          title
          description
          when
          designers
        }
      }
    }
    allDesignersYaml {
      edges {
        node {
          slug
          name
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
