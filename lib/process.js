var rank = require('./rank');
var buildGraph = require('./build-graph');

module.exports = function processNodes(nodes, options) {
  return rank(buildGraph(nodes, options));
};
