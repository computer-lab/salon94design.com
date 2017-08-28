import React from 'react'
import Helmet from 'react-helmet'
import styled from 'emotion/react'
import { PageContainer } from '../layouts/containers'
import ImageList from '../layouts/ImageList'
import ProjectSelector from '../layouts/ProjectSelector'
import { pieceImagePath } from '../util'

const LeftPane = styled.div`
  width: calc(100% - 380px);
  height: 100%;
`

const RightPane = styled.div`
  width: 360px;
  position: fixed;
  right: 24px;
`

export default function ProjectTemplate({ data, pathContext }) {
  const { allProjectsYaml, allDesignersYaml } = data
  const { slug: currentProjectSlug } = pathContext

  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const projectSlugs = new Set(projects.map(p => p.slug))

  const pieceImages = []
  designers.forEach(designer => {
    const pieces = designer.pieces.filter(piece => piece.projects.includes(currentProjectSlug))

    pieces.forEach(piece => {
      piece.images.forEach((src, i) => {
        pieceImages.push({
          src: pieceImagePath(src),
          linkPath: `/designers/${designer.slug}/${piece.slug}`,
          leftText: i === 0 && piece.caption,
          rightText: i === 0 && piece.price
        })
      })
    })
  })

  const images = []
  for (let i = 0; i < 10; i++) { // TODO: remove temporary image multiplication
    pieceImages.forEach(item => images.push(item))
  }

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Projects`} />
      <LeftPane>
        <ImageList images={images} />
      </LeftPane>
      <RightPane>
        <ProjectSelector
          projects={projects}
          currentProjectSlug={currentProjectSlug}
        />
      </RightPane>
    </PageContainer>
  )
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
