'use strict';

function visitPreOrder(node, graph, parent, offset, cb) {
  cb(node, graph, parent, offset);

  node.children.forEach(function (id, i) {
    var child = graph.nodesById[id];
    visitPreOrder(child, graph, node, i, cb);
  });
}

function annotateLevel(node, graph, parent, offset) {
  var parentLevel = typeof parent === 'object' ? parent.stats._broccoli_viz.level : 0;

  node.stats._broccoli_viz.level = parentLevel + offset;

  return node;
}

/**
  @param {graph} Object 
  @param {graph.nodes} Array array of heimdall nodes by json order
  @param {graph.nodesById} Array array of heimdall nodes by id
*/
module.exports = function rank(graph, theLevel) {
  function byTotalTime(childId1, childId2) {
    var c1 = graph.nodesById[childId1];
    var c2 = graph.nodesById[childId2];

    var c1v = c1.stats._broccoli_viz;
    var c2v = c2.stats._broccoli_viz;

    return c2v.totalTime - c1v.totalTime;
  }

  function sortChildren(node) {
    node.children.sort(byTotalTime);
  }

  graph.nodes.forEach(sortChildren);

  visitPreOrder(graph.nodes[0], graph, undefined, 0, annotateLevel);

  return graph;
};

// 
