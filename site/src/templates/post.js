import React from 'react'
import Helmet from 'react-helmet'

export default function Template({ data }) {
  const { markdownRemark: post, allDesignersYaml } = data

  const designers = allDesignersYaml.edges.map(edge => edge.node)

  return (
    <div className="blog-post-container">
      <Helmet title={`Salon 94 Design - ${post.frontmatter.title}`} />
      <div className="blog-post">
        <h1>
          {post.frontmatter.title}
        </h1>

        <h4>Here are my designers:</h4>
        <ul>
          {designers.map(item =>
            <li>
              {item.name} — {item.projects.join(', ')}
            </li>
          )}
        </ul>

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    allDesignersYaml {
      edges {
        node {
          name
          projects
        }
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
