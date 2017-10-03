const crypto = require('crypto');
const path = require('path');
const jsYaml = require('js-yaml');
const _ = require(`lodash`);

async function onCreateNode({ node, boundActionCreators, loadNodeContent }) {
  const { createNode, createParentChildLink } = boundActionCreators

  if (node.internal.mediaType !== 'text/yaml') {
    return;
  }

  const obj = jsYaml.load(await loadNodeContent(node));
  const contentDigest = crypto
    .createHash(`md5`)
    .update(JSON.stringify(obj))
    .digest(`hex`);
  const nodeDir = path.basename(node.dir);
  const yamlNode = {
    ...obj,
    id: obj.id ? obj.id : `${node.id} >>> YAML`,
    children: [],
    parent: node.id,
    internal: {
      contentDigest,
      type: _.upperFirst(_.camelCase(`${nodeDir} Yaml`)),
    },
  };

  createNode(yamlNode)
  createParentChildLink({ parent: node, child: yamlNode })
}

exports.onCreateNode = onCreateNode;
