var match = require('minimatch');

function anyMatch(key, patterns) {
  return patterns.some(function (pattern) {
    return match(key, pattern);
  });
}

function collectStats(stats, patterns, prefix) {
  var result = [];
  var key;
  var value;
  var isTime;

  for (var prop in stats) {
    key = prefix + prop;
    value = stats[prop];

    if (typeof value === 'object') {
      result = result.concat(collectStats(value, patterns, key + '.'));
    } else {
      if (anyMatch(key, patterns)) {
        isTime = (prop === 'time') || match(key, 'time.*') || match(key, '*.time.*');

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
