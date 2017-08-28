import React from 'react'
import Helmet from 'react-helmet'
import styled from 'emotion/react'
import { PageContainer } from '../layouts/containers'
import ProjectSelector from '../layouts/ProjectSelector'

const LeftPane = styled.div`
  width: calc(100% - 360px);
  height: 100%;
`

const RightPane = styled.div`width: 360px;`

export default function ProjectTemplate({ data, pathContext }) {
  const { allProjectsYaml } = data
  const { slug: currentProjectSlug } = pathContext

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Projects`} />
      <LeftPane>
        <h4>Here are my projects:</h4>
        <ul>
          {projects.map(item =>
            <li key={item.slug}>
              {item.title}
            </li>
          )}
        </ul>
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
  }
`
