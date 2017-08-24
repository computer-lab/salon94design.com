import React from 'react';
import Helmet from 'react-helmet';

export default function Template({
  data // this prop will be injected by the GraphQL query we'll write in a bit
}) {
  const { markdownRemark: post } = data; // data.markdownRemark holds our post data
  const { allHeroesYaml: heroes } = data;
  return (
    <div className="blog-post-container">
      <Helmet title={`Salon 94 Design - ${post.frontmatter.title}`} />
      <div className="blog-post">
        <h1>{post.frontmatter.title}</h1>
        Here are some of my heroes:
        <ul>
          {heroes.edges.map((hero) => <li>{hero.node.name}</li>)}
        </ul>
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    allHeroesYaml {
      edges {
        node {
          name
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
;
