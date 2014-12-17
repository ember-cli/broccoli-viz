// usage: DUMP_BROCCOLI_TREES=true broccoli serve 
// results: ./broccoli-tree.json
// converting to dot: node $BROCCOLI_PATH/scripts/graph broccoli-trees.json > graph.dot
// visualizing: dot -Tpng graph.dot -o graph.png
var fs = require('fs')
var out = 'digraph G {'

function formatTime(time) {
  return Math.floor(time / 1e6) +'ms'
}

var inputPath = process.argv[2]

if (!inputPath) {
  throw new Error('Usage: node graph path/to/broccoli-tree.json');
}

out += 'ratio = "auto"'

JSON.parse(fs.readFileSync(inputPath).toString()).forEach(function(node) {
  out += node.id
 

  if (node.description) {
    out += ' [shape=box, label=" ' + node.id + ' ' + ' (' + formatTime(node.selfTime) + ') \n' + node.description + '" ]'
  } else {
    out += ' [shape=circle, style="dotted", label=" ' + node.id + ' (' + formatTime(node.selfTime) + ') " ]'
  }

  out += '\n'
  node.subtrees.forEach(function(t) {
    out += ' ' + node.id + ' -> ' + t + ' \n'
  })
})

console.log(out + '}')
