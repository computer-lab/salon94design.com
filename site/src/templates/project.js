import React from 'react'
import Helmet from 'react-helmet'
import styled from 'emotion/react'
import { PageContainer } from '../layouts/containers'
import ImageList from '../layouts/ImageList'
import ProjectSelector from '../layouts/ProjectSelector'
import { pieceImagePath } from '../util'

const LeftPane = styled.div`
  width: calc(100% - 360px);
  height: 100%;
`

const RightPane = styled.div`width: 360px;`

export default function ProjectTemplate({ data, pathContext }) {
  const { allProjectsYaml, allDesignersYaml } = data
  const { slug: currentProjectSlug } = pathContext

  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const projectSlugs = new Set(projects.map(p => p.slug))

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const pieces = designers.reduce((a, d) => {
    const dp = d.pieces.filter(piece => {
      return piece.projects.filter(project => projectSlugs.has(project)).length > 0
    })

    return a.concat(dp)
  }, [])

  const images = pieces
    .reduce((a, p) => a.concat(p.images), [])
    .map(src => ({
      src: pieceImagePath(src),
      text: 'Hiiiii'
    }))

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
          pieces {
            title
            when
            projects
            tags
            images
          }
        }
      }
    }
  }
`
