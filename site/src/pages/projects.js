import React from 'react'
import Helmet from 'react-helmet'

const Projects = ({ data }) => {
  const { allProjectsYaml } = data

  const projects = allProjectsYaml.edges.map(edge => edge.node)

  return (
    <div>
      <Helmet title={`Salon 94 Design - Projects`} />
      <h4>Here are my projects:</h4>
      <ul>
        {projects.map(item =>
          <li key={item.slug}>
            {item.title}
          </li>
        )}
      </ul>
    </div>
  )
}

export default Projects

export const pageQuery = graphql`
  query ProjectsQuery {
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
