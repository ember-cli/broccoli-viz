#!/usr/bin/env node

var fs = require('fs');
var diffJSON = require('./diff-json');
var ChalkConstructor = require('chalk').constructor;
var isPrimitive = require('./utils').isPrimitive;
var sprintf = require('sprintf-js').sprintf;
var alphanum = require('./alphanum').alphanum;
// we do this only so that we can | less with colour
var chalk = new ChalkConstructor({ enabled: true});

var a = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var b = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

var diff = diffJSON(a, b, { diffId: 'treeId' });
var lastNode;


function isValueRange(obj) {
  return typeof obj === 'object' &&
    obj.hasOwnProperty('before') &&
    obj.hasOwnProperty('after');
}

function isCountTimePair(obj) {
  return typeof obj === 'object' &&
    obj.hasOwnProperty('count') &&
    obj.hasOwnProperty('time');
}

function valueLength(value) {
  if (isCountTimePair(value)) {
    return Math.max(valueLength(value.count), valueLength(value.time));
  } else if (! isValueRange(value) ||
      typeof value.before === "string") {

    return 0;
  } else if (value.before === undefined) {
    return 1;
  } else {
    return sprintf('%.2f', value.before).length;
  }
}

function spaces(n) {
  return new Array(n+1).join(' ');
}


/**
  Return `Object.keys(obj)` sorted as follows:

  1. Number value ranges
  2. String value ranges
  3. All other types

  Within the same type, keys are sorted lexicographically.
*/
function sortedKeys(obj) {
  function typeRank(a) {
    if (isPrimitive(a)) {
      return 1;
    } else if (isValueRange(a)) {
      var rangeType = typeof (a.before || a.after);
      if (rangeType === 'number') {
        return 2;
      } else if (rangeType === 'string') {
        return 3;
      } else {
        throw new Error("Unexpected value range type: " + rangeType);
      }
    } else if (! Array.isArray(a)) {
      return 4;
    } else {
      return 5;
    }
  }

  function compare(a, b) {
    var aValue = obj[a];
    var bValue = obj[b];

    var aRank = typeRank(aValue);
    var bRank = typeRank(bValue);

    if (aRank === bRank) {
      // sort by key
      return alphanum(a, b);
    } else if (aRank < bRank) {
      return -1;
    } else {
      return 1;
    }
}

  return Object.keys(obj).sort(compare);
}

function opts(options) {
  options = options || {};
  options.indent = options.indent || '';
  options.key = options.key || '';
  options.maxKeyLen = options.maxKeyLen || 0;
  options.maxBeforeWidth = options.maxBeforeWidth || 0;
  options.maxAfterWidth = options.maxAfterWidth || 0;

  return options;
}

function printStringValueRangeDiff(diff, options) {
  options = opts(options);

  var separator;

  if (typeof diff.before === 'string' ^
      typeof diff.after === 'string') {

    separator = "\n" + options.indent + options.key.replace(/./g, ' ') + spaces(options.maxKeyLen - options.key.length);
  } else {
    separator = (diff.before !== diff.after) ? ' → ' : ' = ';
  }

  var lhs = (diff.before !== diff.after) ? diff.before : '';
  process.stdout.write(sprintf('%s%s%s', lhs, separator, diff.after));
}

function printNumericValueRangeDiff(diff, options) {
  options = opts(options);

  var color;
  if (diff.before === diff.after) {
    color = 'reset';
  } else if (diff.before < diff.after) {
    color = 'red';
  } else {
    color = 'green';
  }
  var colorize = chalk[color];

  var lhs = (diff.before !== diff.after) ? diff.before : '';
  var separator = (diff.before !== diff.after) ? '→' : '=';
  var rhs = diff.after && sprintf('%.2f', diff.after) || '';

  var leftColumn = sprintf('%' + options.maxBeforeWidth + 's', lhs);
  var centerColumn = colorize(' ' + separator + ' ');
  var rightColumn = colorize(sprintf('%' + options.maxAfterWidth + 's', rhs));

  process.stdout.write(leftColumn + centerColumn + rightColumn);
}

function printValueRangeDiff(diff, options) {
  options = opts(options);

  if (typeof diff.before === 'string' ||
      typeof diff.after === 'string') {

    return printStringValueRangeDiff(diff, options);
  } else {
    return printNumericValueRangeDiff(diff, options);
  }
}

function printObjectDiff(diff, options) {
  options = opts(options);

  var keys = sortedKeys(diff);
  var maxKeyLen = keys.reduce(function(max, key){ return Math.max(max, key.length); }, 0);
  var maxBeforeWidth;
  var maxAfterWidth;

  if (isCountTimePair(diff)) {
    maxBeforeWidth = options.maxBeforeWidth;
    maxAfterWidth = options.maxAfterWidth;
  } else {
    maxBeforeWidth = keys.reduce(function (max, key) {
      return Math.max(max, valueLength(diff[key], 'before'));
    }, 0);
    maxAfterWidth = keys.reduce(function (max, key) {
      return Math.max(max, valueLength(diff[key], 'after'));
    }, 0);
  }

  process.stdout.write("\n");
  keys.forEach(function(key, idx, array) {
    process.stdout.write(sprintf('%s%-' + (maxKeyLen + 2) + 's', options.indent, key + ':'));

    var value = diff[key];
    printDiff(value, {
      indent: options.indent + '  ',
      key: key,
      maxKeyLen: maxKeyLen,
      maxBeforeWidth: maxBeforeWidth,
      maxAfterWidth: maxAfterWidth
    });
    if (idx < array.length - 1) {
      process.stdout.write("\n");
    }
  });
}

function printDiff(diff, options) {
  options = opts(options);

  if (isValueRange(diff)) {
    return printValueRangeDiff(diff, options);
  } else if (isPrimitive(diff)) {
    return process.stdout.write(diff+"");
  } else {
    printObjectDiff(diff, options);
  }
}


printDiff(diff);
process.stdout.write("\n");
