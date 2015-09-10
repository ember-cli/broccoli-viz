/* global Set:true */
var Set = require('./set');
var assert = require('assert');
var isPrimitive = require('./utils').isPrimitive;

module.exports = diffJSON;


/**
  Produce a diff of `a` and `b`, two json objects.  Describing the changes at
  leaves.  Assumes no primitive values change to objects and no objects change to
  primitive values.

  @example
    var a = {
      foo: 1,
      bar: {
        v: 1,
      },
    }
    var b = {
      foo: 2,
      bar: {
        v: 2,
      },
      baz: {
        v1: 1,
      }
    };

    diffJSON(a, b) // => {
      foo: {
        before: 1,
        after: 2,
      },

      bar: {
        v: {
          before: 1,
          after: 2,
        },
      },

      baz: {
        v1: {
          before: undefined,
          after: 1,
        },
      },
    }
*/
function diffJSON(a, b, options) {
  options = options || {};
  options.diffId = options.diffId || 'id';

  // base case of the recursion
  if (isPrimitive(a) || isPrimitive(b)) {
    return {
      before: a,
      after: b,
    };
  }

  a = a !== undefined ? a : {};
  b = b !== undefined ? b : {};
  

  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  var result = {};

  aKeys.forEach(function(key) {
    setKey(result, key, a, b, options);
  });

  var newBKeys = new Set(bKeys).deleteAll(aKeys);
  newBKeys.forEach(function(key) {
    setKey(result, key, a, b, options);
  });

  return result;
}

function setKey(obj, key, a, b, options) {
  var aValue = (a || {})[key];
  var bValue = (b || {})[key];
  var isArray = Array.isArray(aValue) || Array.isArray(bValue);

  if (isArray) {
    obj[key] = diffArray(aValue, bValue, options);
  } else if (key === options.diffId) {
    // Here we don't handle the case of `id` changing.  We assume that id is
    // either the same, or exactly one of `[aValue, bValue]` is `undefined`
    obj[key] = aValue || bValue;
  } else {
    obj[key] = diffJSON(aValue, bValue, options);
  }
}

function diffArray(aValue, bValue, options) {
  assert(Array.isArray(aValue) || aValue === undefined);
  assert(Array.isArray(bValue) || bValue === undefined);

  var compare = compareBy(options.diffId);

  aValue = (aValue || []).sort(compare);
  bValue = (bValue || []).sort(compare);

  var aIdx = 0;
  var bIdx = 0;
  var aItem;
  var bItem;
  var result = [];

  while(aIdx < aValue.length || bIdx < bValue.length) {
    aItem = aValue[aIdx];
    bItem = bValue[bIdx];

    switch (compare(aItem, bItem)) {
      case 0:
        result.push(diffJSON(aItem, bItem, options));
        ++aIdx;
        ++bIdx;
        break;
      case -1:
        result.push(diffJSON(aItem, undefined, options));
        ++aIdx;
        break;
      case 1:
        result.push(diffJSON(undefined, bItem, options));
        ++bIdx;
        break;
    }
  }

  return result;
}

function compareBy(key) {
  return function compare(a, b) {
    if (a === undefined && b !== undefined) {
      return 1;
    } else if (a !== undefined && b === undefined) {
      return -1;
    }

    var aValue = (a.hasOwnProperty(key)? a[key] : '') + '';
    var bValue = (b.hasOwnProperty(key)? b[key] : '') + '';

    if (aValue === bValue) {
      return 0;
    } else if (aValue < bValue || (bValue === undefined)) {
      return -1;
    } else {
      return 1;
    }
  };
}
