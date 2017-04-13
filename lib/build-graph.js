var nodesById = require('./nodes-by-id');
const normalizeNodes = require('./normalize-nodes');

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

function fromRoot(graph, root) {
  if (root === undefined) { return graph; }

  var rootNode = graph.nodesById[root];

  if (!rootNode) {
    throw new TypeError("Can't find root: " + root);
  }

  var reachable = _reachable(graph, rootNode);
  return {
    nodesById: nodesById(reachable),
    nodes: reachable
  }
}

function _reachable(graph, root, acc) {
  if (!acc) {
    acc = [];
  }

  if (acc.indexOf(root) > -1) {
    return acc;
  }

  acc.push(root);
  root.children.forEach(function (childId) {
    _reachable(graph, graph.nodesById[childId], acc);
  });

  return acc;
}

module.exports = function(nodes, _options) {
  var options = _options || {};
  let normalizedNodes = normalizeNodes(nodes);
  var byId = nodesById(normalizedNodes);

  let graph = {
    nodesById: byId,
    nodes: normalizedNodes,
  };

  return annotateNodes(fromRoot(graph, options['root-id']));
};
