var nodesById = require('./nodes-by-id');

/**
  Annotate `node` with
    stats._broccoli_viz = {
      totalTime,
    }
*/
function annotateNode(node, graph) {
  var childTime = node.children.reduce(function (acc, childId) {
    var node = graph.nodesById[childId];
    return acc + node.stats._broccoli_viz.totalTime;
  }, 0);

  node.stats._broccoli_viz = {
    totalTime: childTime + node.stats.time.self,
  };

  return node;
}

function visitPostOrder(node, graph, cb) {
  node.children.forEach(function (id) {
    var child = graph.nodesById[id];
    visitPostOrder(child, graph, cb);
  });

  cb(node, graph);
}

function annotateNodes(graph) {
  visitPostOrder(graph.nodes[0], graph, annotateNode);

  return graph;
}

module.exports = function(nodes) {
  var byId = nodesById(nodes);

  var graph = {
    nodesById: byId,
    nodes: nodes,
  };

  return annotateNodes(graph);
};
