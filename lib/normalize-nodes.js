module.exports = function normalizeNodes(nodes) {
  return nodes.map(node => {
    if (node._id) {
      node.label = node.id;
      node.id = node._id;
      delete node._id;
    }
    return node;
  });
}
