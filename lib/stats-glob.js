var MatcherCollection = require('matcher-collection');
var timeMatcher = new MatcherCollection([
  'time.*',
  '*.time.*',
]);

function collectStats(stats, patterns, prefix) {
  var result = [];
  var key;
  var value;
  var isTime;

  var matcher = new MatcherCollection(patterns);

  for (var prop in stats) {
    key = prefix + prop;
    value = stats[prop];

    if (typeof value === 'object') {
      result = result.concat(collectStats(value, patterns, key + '.'));
    } else {
      if (matcher.match(key)) {
        isTime = (prop === 'time') || timeMatcher.match(key);

        result.push({
          key: key,
          value: value,
          isTime: isTime,
        });
      }
    }
  }
  
  return result;
}

module.exports = function statsGlob(stats, patterns) {
  return collectStats(stats, patterns, '');
};
