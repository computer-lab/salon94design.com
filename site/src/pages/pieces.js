import React from 'react'
import Helmet from 'react-helmet'
import { pieceImagePath } from '../util'

const Pieces = ({ data }) => {
  const { allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const pieces = designers.reduce((items, d) => items.concat(d.pieces), [])

  return (
    <div>
      <Helmet title={`Salon 94 Design - Pieces`} />
      <h4>Here are my pieces:</h4>
      <ul>
        {pieces.map(item =>
          <li key={item.title}>
            {item.title}
            {item.images.map(src =>
              <img key={src} src={pieceImagePath(src)} />
            )}
          </li>
        )}
      </ul>
    </div>
  )
}

export default Pieces

export const pageQuery = graphql`
  query PiecesQuery {
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
