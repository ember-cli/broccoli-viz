var flatten = require('./flatten');
var dot = require('./dot')
var assert = require('assert');

function toJSON() { return this; }

function node(n) {
  n.toJSON = toJSON;
  return n;
}

describe('flatten', function() {
  it('works with one root', function(){
    var node = {
      subtrees: []
    };

    var result = flatten(node);

    assert.equal(result.length, 1);
    assert.deepEqual(result, [node]);
  });

  it('works with 2 levels', function() {
    var a = node({ id: 'a', subtrees: [] });
    var b = node({ id: 'b', subtrees: [] });
    var c = node({ id: 'c', subtrees: [a, b] });

    var result = flatten(c);

    assert.equal(result.length, 3);
    assert.deepEqual(result, [c, a, b]);
  });

  it('works with messy tree and 4 levels', function() {
    var a = node({ id: 'a', subtrees: [] });
    var b = node({ id: 'b', subtrees: [] });
    var c = node({ id: 'c', subtrees: [a, b] });
    var d = node({ id: 'd', subtrees: [c] });
    var e = node({ id: 'e', subtrees: [d, b] });

    var result = flatten(e);

    assert.equal(result.length, 5);
    assert.deepEqual(result, [e , d, c, a, b]);
  });
});

describe('dot', function() {
  it('works with one root', function(){
    var a = node({
      id: 'a',
      subtrees: []
    });

    var result = dot(flatten(a));

    assert.equal(result, 'digraph G {ratio = \"auto\"a [shape=circle, style=\"dotted\", label=\" a (NaNms) \" ]\n}');
  });
});
