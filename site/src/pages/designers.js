import React from 'react'
import Helmet from 'react-helmet'

const Designers = ({ data }) => {
  const { allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  return (
    <div>
      <Helmet title={`Salon 94 Design - Designers`} />
      <h4>Here are my designers:</h4>
      <ul>
        {designers.map(item =>
          <li key={item.name}>
            {item.name}
          </li>
        )}
      </ul>
    </div>
  )
}

export default Designers

export const pageQuery = graphql`
  query DesignersQuery {
    allDesignersYaml {
      edges {
        node {
          name
          slug
        }
      }
    }
  }
`
