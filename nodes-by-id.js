module.exports = function nodesById(nodes) {
  let result = new Array(nodes.length);

  nodes.forEach(function(node) {
    result[node.id] = node;
  });
  return result;
}
