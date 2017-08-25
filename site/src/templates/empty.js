import React from 'react'
import Helmet from 'react-helmet'

export default function Template({ data }) {
  const { allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  return (
    <div className="blog-post-container">
      <h4>Here are my designers:</h4>
      <ul>
        {designers.map(item =>
          <li>
            {item.name} — {item.projects.join(', ')}
          </li>
        )}
      </ul>
    </div>
  )
}

export const pageQuery = graphql`
  query DesignersQuery {
    allDesignersYaml {
      edges {
        node {
          name
          projects
        }
      }
    }
  }
`
