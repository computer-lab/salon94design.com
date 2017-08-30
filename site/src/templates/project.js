import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import {
  createPanes,
  PageContainer,
  FlexBetweenContainer,
} from '../layouts/containers'
import { sansfont, monofont } from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import ProjectSelector from '../layouts/ProjectSelector'
import PieceSummary from '../layouts/PieceSummary'
import { pieceImagePath } from '../util'

const { LeftPane, RightPane } = createPanes()

const ProjectHeader = styled.div`
  composes: ${sansfont};
  position: fixed;
  top: 20px;
`

const ProjectTitle = styled.h1`
  margin: 0 0 8px 0;
  padding: 0;
  font-weight: normal;
  font-size: 26px;
`

const ProjectDesigner = styled.span`
  & a {
    color: inherit;
    text-decoration: inherit;

    &:hover,
    &:focus {
      border-bottom: 2px solid #000;
    }
  }

  &:not(:first-child)::before {
    content: " / ";
  }

  &:last-child::after {
    content: " ";
  }
`

const ProjectDescription = styled.div`
  font-size: 16px;
  line-height: 1.2;
  max-width: 320px;
`

const ProjectWhen = styled.div`
  composes: ${monofont};
  margin-top: -2px;
  font-weight: bold;
  font-size: 24px;
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
    const currentProject = projects.find(p => p.slug === currentProjectSlug)

    const designers = allDesignersYaml.edges.map(edge => edge.node)
    const getDesigner = slug => designers.find(d => d.slug === slug)

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
          <ProjectHeader>
            <ProjectTitle>
              {currentProject.designers.map(slug =>
                <ProjectDesigner key={slug}>
                  <Link to={`/designers/${slug}`}>
                    {getDesigner(slug).name}
                  </Link>
                </ProjectDesigner>
              )}
              — {currentProject.title}
            </ProjectTitle>
            <FlexBetweenContainer>
              <ProjectDescription>
                {currentProject.description}
              </ProjectDescription>
              <ProjectWhen>
                {currentProject.when}
              </ProjectWhen>
            </FlexBetweenContainer>
          </ProjectHeader>
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
