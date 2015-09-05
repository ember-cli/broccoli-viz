'use strict';

// largest to smaller
function byTotalTime(x, y) {
  return y.totalTime - x.totalTime;
}

var nextId = 0;

function guid(obj) {
  if (obj === undefined) {
    return "undefined";
  } else if(obj === null) {
    return "null";
  } else if (typeof obj === "number") {
    return "n_" + obj;
  } else if (typeof obj === "string") {
    return "str_" + obj;
  }

  if (! obj.hasOwnProperty('_viz_id')) {
    obj._viz_id = (++nextId);
  }

  return obj._viz_id;
}


function RankedNode(node, level) {
  this.id = node.id;
  this.treeId = guid(node.tree);
  this.level = level;
  this.node = node;
  this.subtrees = [];
  this.stats = {}; // Bucket for additional stats and metrics
}

function normalizeTimeInNs(time) {
  return Math.round(time/ 1e4) / 1e2;
}

RankedNode.prototype.toJSON  = function() {
  var json = this.node.toJSON();
  json.treeId = this.treeId;
  json.level = this.level;
  json.stats = this.stats;
  json.selfTime = normalizeTimeInNs(json.selfTime);
  json.totalTime = normalizeTimeInNs(json.totalTime);
  return json;
};

module.exports = function level(root, theLevel) {
  var currentLevel = arguments.length === 1 ? 0 : theLevel;

  // TODO: add ranking system
  var leveled = new RankedNode(root, currentLevel);

  var subtrees = root.subtrees;
  if (subtrees.length === 0 ) { return leveled; }

  leveled.subtrees = subtrees.sort(byTotalTime).map(function(unleveled, i) {
    return level(unleveled, currentLevel + i);
  });

  return leveled;
};
