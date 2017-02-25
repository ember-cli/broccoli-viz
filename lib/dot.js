var statsGlob = require('./stats-glob');

function formatTime(time) {
  return Math.floor(time / 1e6) + 'ms';
}

// replace this with actual math
function selfTimeColor(n) {
  var number = n/ 1e6;

  if (number > 5000) { return 1; }
  if (number > 2000) { return 2; }
  if (number > 1000) { return 3; }
  if (number >  250) { return 4; }
  if (number >  100) { return 5; }
  if (number >   50) { return 6; }
  if (number >   10) { return 7; }
  if (number >    5) { return 8; }
  return 9;
}

function penWidth(level) {
  if (level === 0) return 3;
  if (level === 1) return 1.5;
  return 0.5;
}

function statsString(node, patterns) {
  var selfTime = node.stats.time.self;
  node.stats.time.total = node.stats._broccoli_viz.totalTime;

  var matchingStats = statsGlob(node.stats, patterns);

  
  var result = matchingStats.map(function (stat) {
    var key = stat.key;
    var value = stat.value;

    if (stat.isTime) {
      value = formatTime(value);
    }

    return key + ' (' + value + ')';
  });

  return result.join('\\n');
}

module.exports = function dot(graph, options) {
  var out = 'digraph G {';
  out += ' ratio = "auto"\n';

  var patterns = options && options.stats;

  if (!patterns) {
    patterns = ['time.self', 'time.total'];
  }

  graph.nodes.forEach(function(node) {
    var selfTime = node.stats.time.self;

    out += ' ' + node._id;
    var annotation = node.id.name;
    annotation = annotation.replace(' (', '\\n(');

    var shape, style;

    if (annotation.indexOf('Merge') > -1) {
      shape = 'circle';
      style = 'dashed';
    } else if (annotation.indexOf('Funnel') > -1) {
      shape = 'box';
      style = 'dashed';
    } else {
      shape = 'box';
      style = 'solid';
    }

    out += ' [shape=' + shape + ', style=' + style + ', colorscheme="rdylbu9", color=' + selfTimeColor(selfTime) +', label="' +
       node._id + '\\n' +
       annotation  + '\\n' +
       statsString(node, patterns) +
       '"]';

    out += '\n';

    node.children.forEach(function(childId) {
      // such doubts
      // var level = node.level + byId[child].level;
      var level = graph.nodesById[childId].stats._broccoli_viz.level;
      out += ' ' + childId + ' -> ' + node._id + ' [penwidth=' + penWidth(level) + ']\n';
    });
  });
  out += '}';
  return out;
};
