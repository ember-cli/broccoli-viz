var buildGraph = require('../lib/build-graph');
var assert = require('assert');

function byTotalTime(node) {
  return node.stats._broccoli_viz.totalTime;
}

describe('buildGraph', function() {
  it('handles graphs with a single node', function() {
    var node = {
      _id: 1,
      stats: {
        time: {
          self: 10,
        }
      },
      children: [],
    };

    var graph = buildGraph([node]);

    assert.equal(graph.nodes.length, 1, 'graph has correct number of nodes');
    assert.deepEqual(graph.nodes[0].stats._broccoli_viz, {
      totalTime: 10,
    }, 'nodes are annotated with total time');

    assert.deepEqual(graph.nodesById[1], node, 'nodes can be looked up by id');
  });

  it('handles graphs with children', function() {
    var root = {
      _id: 1,
      stats: {
        time: {
          self: 1,
        }
      },
      children: [2, 4],
    };

    var node2 = {
      _id: 2,
      stats: {
        time: {
          self: 2,
        }
      },
      children: [3],
    };

    var node3 = {
      _id: 3,
      stats: {
        time: {
          self: 4,
        }
      },
      children: [],
    };

    var node4 = {
      _id: 4,
      stats: {
        time: {
          self: 8,
        }
      },
      children: [],
    };

    var graph = buildGraph([root, node2, node3, node4]);

    assert.equal(graph.nodes.length, 4, 'graph has correct number of nodes');
    assert.deepEqual(graph.nodes.map(byTotalTime), [
      15, 6, 4, 8
    ], 'nodes are annotated with total time');

    assert.deepEqual(graph.nodesById[1], root);
    assert.deepEqual(graph.nodesById[2], node2);
    assert.deepEqual(graph.nodesById[3], node3);
    assert.deepEqual(graph.nodesById[4], node4);
  });

  it('handles subgraphs starting at root-id', function() {
    var root = {
      _id: 1,
      stats: {
        time: {
          self: 1,
        }
      },
      children: [2, 4],
    };

    var node2 = {
      _id: 2,
      stats: {
        time: {
          self: 2,
        }
      },
      children: [3],
    };

    var node3 = {
      _id: 3,
      stats: {
        time: {
          self: 4,
        }
      },
      children: [],
    };

    var node4 = {
      _id: 4,
      stats: {
        time: {
          self: 8,
        }
      },
      children: [],
    };

    var graph = buildGraph([root, node2, node3, node4], { 'root-id': 2 });

    assert.equal(graph.nodes.length, 2, 'graph has correct number of nodes');
    assert.deepEqual(graph.nodes.map(byTotalTime), [
      6, 4
    ], 'nodes are annotated with total time');

    assert.deepEqual(graph.nodesById[2], node2);
    assert.deepEqual(graph.nodesById[3], node3);
  });
});
