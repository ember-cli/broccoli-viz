const assert = require('assert');
const normalizeNodes = require('../normalize-nodes');

describe('normalizeNodes', function() {
  it('normalizes 2.11 format to 2.12 format', function() {
    let nodes = [{
      _id: 1,
      id: { name: 'a', },
    }, {
      id: 2,
      label: { name: 'b', },
    }];

    let normalized = normalizeNodes(nodes);

    assert.deepEqual(
      normalized,
      [{
        id: 1,
        label: { name: 'a' },
      }, {
        id: 2,
        label: { name: 'b' },
      }]
    );
  });
});
