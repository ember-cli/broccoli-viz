const assert = require('assert');
const nodesById = require('../nodes-by-id');

describe('nodesById', function() {
  it('builds a map of nodes with 2.12 format (id)', function() {
    let nodes = [{
      id: 1,
      label: { name: 'a', },
    }];
    let map = nodesById(nodes);

    assert.deepEqual(map[1], {
      id: 1,
      label: { name: 'a' },
    });
  });
});
