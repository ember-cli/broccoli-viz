// usage: DUMP_BROCCOLI_TREES=true broccoli serve 
// results: ./broccoli-tree.json
// converting to dot: node $BROCCOLI_PATH/scripts/graph broccoli-trees.json > graph.dot
// visualizing: dot -Tpng graph.dot -o graph.png

function formatTime(time) {
  return Math.floor(time / 1e6) +'ms'
}

module.exports = dot;
function dot(nodes) {
  var out = 'digraph G {';
  out += 'ratio = "auto"'

  nodes.forEach(function(node) {
    out += node.id
    if (node.description) {
      out += ' [shape=box, label=" ' + node.id + ' ' + ' (' + formatTime(node.selfTime) + ') \n' + (node.description || '') + '" ]'
    } else {
      out += ' [shape=circle, style="dotted", label=" ' + node.id + ' (' + formatTime(node.selfTime) + ') " ]'
    }

    out += '\n'
    node.subtrees.forEach(function(t) {
      out += ' ' + node.id + ' -> ' + t + ' \n'
    })
  });
  out + '}';
  return out;
}
