var rank = require('./rank');
var buildGraph = require('./build-graph');

module.exports = function processNodes(nodes) {
  return rank(buildGraph(nodes));
};
