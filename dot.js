// usage: DUMP_BROCCOLI_TREES=true broccoli serve
// results: ./broccoli-tree.json
// converting to dot: node $BROCCOLI_PATH/scripts/graph broccoli-trees.json > graph.dot
// visualizing: dot -Tpng graph.dot -o graph.png

function formatTime(time) {
  return Math.floor(time / 1e6) +'ms';
}

module.exports = function dot(nodes) {
  var out = 'digraph G {';
  out += 'ratio = "auto"';

  nodes.map(function(node) {
    return node.toJSON();
  }).forEach(function(node) {
    out += node.id;
    var annotation = node.annotation || node.description;
    if (annotation) {
      annotation = annotation.replace('(', '\n(');
      out += ' [shape=box, label=" ' + node.id + ' ' + ' (' + formatTime(node.selfTime) + ') \n' + annotation  + '" ]';
    } else {
      out += ' [shape=circle, style="dotted", label=" ' + node.id + ' (' + formatTime(node.selfTime) + ') " ]';
    }

    out += '\n';
    node.subtrees.forEach(function(child) {
      out += ' ' + child + ' -> ' + node.id + ' \n';
    });
  });
  out += '}';
  return out;
};
