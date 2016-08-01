var assert = require('assert');
var statsGlob = require('../stats-glob');

describe('statsGlob', function() {
  var stats = {
    fs: {
      lstatSync: {
        count: 2,
        time: 100,
      },
      mkdirSync: {
        count: 1,
        time: 50
      },
    },

    own: {
      render: {
        count: 10,
        time: 200,
      }
    },

    time: {
      self: 100
    },
  };

  it('returns matching stats', function() {
    var result = statsGlob(stats, ['fs.*.count']);

    assert.deepEqual(result, [{
      key: 'fs.lstatSync.count',
      value: 2,
      isTime: false,
    }, {
      key: 'fs.mkdirSync.count',
      value: 1,
      isTime: false,
    }]);

    result = statsGlob(stats, ['fs.lstat*.count', 'own.render.c*']);

    assert.deepEqual(result, [{
      key: 'fs.lstatSync.count',
      value: 2,
      isTime: false,
    }, {
      key: 'own.render.count',
      value: 10,
      isTime: false,
    }]);

    result = statsGlob(stats, ['*.count']);

    assert.deepEqual(result, [{
      key: 'fs.lstatSync.count',
      value: 2,
      isTime: false,
    }, {
      key: 'fs.mkdirSync.count',
      value: 1,
      isTime: false,
    }, {
      key: 'own.render.count',
      value: 10,
      isTime: false,
    }]);
  });

  it('marks stats named time as time stats', function() {
    var result = statsGlob(stats, ['fs.*', 'time.*']);

    assert.deepEqual(result, [{
      key: 'fs.lstatSync.count',
      value: 2,
      isTime: false,
    }, {
      key: 'fs.lstatSync.time',
      value: 100,
      isTime: true,
    }, {
      key: 'fs.mkdirSync.count',
      value: 1,
      isTime: false,
    }, {
      key: 'fs.mkdirSync.time',
      value: 50,
      isTime: true,
    }, {
      key: 'time.self',
      value: 100,
      isTime: true,
    }]);
  });
});
