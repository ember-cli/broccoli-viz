var flatten = require('./flatten');
var dot = require('./dot')
var assert = require('assert');

describe('flatten', function() {
  it('works with one root', function(){
    var node = {
      subtrees: []
    };

    var result = flatten(node);

    assert.equal(result.length, 1);
    assert.deepEqual(result, [node]);
  });

  it('works with 2 levels', function(){
    var a = { id: 'a', subtrees: [] };
    var b = { id: 'b', subtrees: [] }
    var c = { id: 'c', subtrees: [a, b] };

    var result = flatten(c);

    assert.equal(result.length, 3);
    assert.deepEqual(result, [c, a, b]);
  });

  it('works with messy tree and 4 levels', function(){
    var a = { id: 'a', subtrees: [] };
    var b = { id: 'b', subtrees: [] }
    var c = { id: 'c', subtrees: [a, b] };
    var d = { id: 'd', subtrees: [c] };
    var e = { id: 'e', subtrees: [d, b] };

    var result = flatten(e);

    assert.equal(result.length, 5);
    assert.deepEqual(result, [e , d, c, a, b]);
  });
});

describe('dot', function() {
  it('works with one root', function(){
    var node = {
      id: 'a',
      subtrees: []
    };

    var result = dot(flatten(node));

    assert.equal(result, 'digraph G {ratio = \"auto\"a [shape=circle, style=\"dotted\", label=\" a (NaNms) \" ]\n');
  });
});
