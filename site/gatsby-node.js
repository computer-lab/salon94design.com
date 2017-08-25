const path = require('path');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const emptyTemplate = path.resolve(`src/templates/empty.js`);
  const postTemplate = path.resolve(`src/templates/post.js`);

  // top-level pages
  createPage({ path: '/projects', component: emptyTemplate })
  createPage({ path: '/designers', component: emptyTemplate })
  createPage({ path: '/pieces', component: emptyTemplate })
  createPage({ path: '/info', component: emptyTemplate })

  // markdown blog posts
  return graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          html
          id
          frontmatter {
            date
            path
            title
          }
        }
      }
    }
  }`
)
    .then(result => {
      if (result.errors) {
        return Promise.reject(result.errors);
      }
      result.data.allMarkdownRemark.edges
        .forEach(({ node }) => {
          createPage({
            path: node.frontmatter.path,
            component: postTemplate,
            context: {} // additional data can be passed via context
          });
        });
    });
}
