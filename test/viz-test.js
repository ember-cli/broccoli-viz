var dot = require('../dot');
var assert = require('assert');
var rank = require('../rank');
var processGraph  = require('../process');
var nodesById = require('../nodes-by-id');
var buildGraph = require('../build-graph');

describe('dot', function() {
  it('works with one root', function(){
    var a = {
      _id: 1,
      id: { name: 'a', },
      stats: {
        time: {
          self: 1000000,
        }
      },
      children: []
    };

    var result = dot(processGraph([a]));

    assert.equal(result, 'digraph G { ratio = \"auto\" 1 [shape=box, style=solid, colorscheme=\"rdylbu9\", color=9, label=\" 1 \na\n self time (1ms) \n total time (1ms)\n \"]\n}');
  });
});


describe('rank', function() {
  it('empty', function(){
    var g = buildGraph([
      {
        _id: 1,
        stats: {
          time: {
            self: 0,
          }
        },
        children: []
      }
    ]);

    var ranked = rank(g).nodes;

    assert.deepEqual(ranked.map(byLevel), [0]);
  });

  function byLevel(node) {
    return node.stats._broccoli_viz.level;
  }

  it('one path', function(){
    var a = {
      _id: 2,
      stats: {
        time: {
          self: 0,
        },
      },
      children: [1]
    };

    var b = {
      _id: 1,
      stats: {
        time: {
          self: 0,
        },
      },
      children: []
    };


    var g = buildGraph([a, b]);

    var ranked = rank(g).nodes;

    assert.deepEqual(ranked.map(byLevel), [0, 0]);
  });

  it('slighty more complex graph', function() {
    /*
            ┌───────────────┐
            │#1 TotalTime: 5│
            └───────────────┘
                    │
        ╔═══════════╩──────────┐
        ║                      │
        ▼                      ▼
┌───────────────┐      ┌───────────────┐
│#2 TotalTime: 4│      │#3 TotalTime: 3│
└───────────────┘      └───────────────┘
        ║                      │
        ║                      │
        ▼                      ▼
┌───────────────┐      ┌───────────────┐
│#4 TotalTime: 2│      │#5 TotalTime: 2│
└───────────────┘      └───────────────┘
        ║                      │
        ║                      │
        ▼                      ▼
┌───────────────┐     ┌────────────────┐
│#6 TotalTime: 2│     │#7 TotalTime: 1 │
└───────────────┘     └────────────────┘
    */

    var g = buildGraph([{
      _id: 1,
      stats: {
        time: {
          self: 0,
        },
      },
      children: [3, 2]
    }, {
      _id: 2,
      stats: {
        time: {
          self: 2,
        },
      },
      children: [4]
    }, {
      _id: 3,
      stats: {
        time: {
          self: 1,
        },
      },
      children: [5]
    }, {
      _id: 4,
      stats: {
        time: {
          self: 0,
        },
      },
      children: [6]
    }, {
      _id: 5,
      stats: {
        time: {
          self: 1,
        },
      },
      children: [7]
    }, {
      _id: 6,
      stats: {
        time: {
          self: 2,
        },
      },
      children: []
    }, {
      _id: 7,
      stats: {
        time: {
          self: 1,
        },
      },
      children: []
    }]);

    var ranked = rank(g).nodes;

    assert.deepEqual(ranked.map(byLevel), [0, 0, 1, 0, 1, 0, 1]);
  });

});

