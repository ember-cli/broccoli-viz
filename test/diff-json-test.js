var diffJSON = require('../diff-json');
var assert = require('assert');


describe("diffJSON", function() {
  it("handles simple objects", function() {
    var a = {
      value: 2,
    };
    var b = {
      value: 4,
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      value: {
        before: 2,
        after: 4,
      }
    });
  });

  it("handles nested objects", function() {
    var a = {
      foo: {
        v1: 1,
        v2: 2,
      },
      bar: {
        v1: 10,
        v2: 20,
      },
    };

    var b = {
      foo: {
        v1: 3,
        v2: 4,
      },
      bar: {
        v1: 30,
        v2: 40,
      },
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      foo: {
        v1: {
          before: 1,
          after: 3,
        },
        v2: {
          before: 2,
          after: 4,
        },
      },
      bar: {
        v1: {
          before: 10,
          after: 30,
        },
        v2: {
          before: 20,
          after: 40,
        },
      },
    });
  });

  it("handles partial changes", function() {
    var a = {
      foo: {
        v1: 1,
        v2: 2,  // <- changes
      },
    };

    var b = {
      foo: {
        v1: 1,
        v2: 4, // <- new value
      },
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      foo: {
        v1: {
          before: 1,
          after: 1,
        },
        v2: {
          before: 2,
          after: 4,
        },
      },
    });
  });

  it("handles added keys", function() {
    var a = {
      foo: {
        v1: 1,
        // will gain v2
      },
    };

    var b = {
      foo: {
        v1: 1,
        v2: 3,
      },
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      foo: {
        v1: {
          before: 1,
          after: 1,
        },
        v2: {
          before: undefined,
          after: 3,
        },
      },
    });
  });

  it("handles removed keys", function() {
    var a = {
      foo: {
        v1: 1,
        v2: 2,  // <- will be removed
      },
    };

    var b = {
      foo: {
        v1: 1,
        // v2 gone
      },
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      foo: {
        v1: {
          before: 1,
          after: 1,
        },
        v2: {
          before: 2,
          after: undefined,
        },
      },
    });
  });

  it("handles added objects", function() {
    var a = {
      // will gain bar: { v2: 3 }
    };

    var b = {
      bar: {
        v2: 3,
      },
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      bar: {
        v2: {
          before: undefined,
          after: 3,
        },
      },
    });
  });

  it("handles added nested objects", function() {
    var a = {
      // will gain bar: { baz: { v2: 3 } }
    };

    var b = {
      bar: {
        baz: {
          v2: 3,
        },
      },
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      bar: {
        baz: {
          v2: {
            before: undefined,
            after: 3,
          },
        },
      },
    });
  });

  it("handles removed objects", function() {
    var a = {
      // bar will be removed
      bar: {
        v2: 3,
      },
    };

    var b = {
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      bar: {
        v2: {
          before: 3,
          after: undefined,
        },
      },
    });
  });

  it("handles removed nested objects", function() {
    var a = {
      // bar will be removed
      bar: {
        baz: {
          v2: 3,
        },
      },
    };

    var b = {
    };

    var result = diffJSON(a, b);
    assert.deepEqual(result, {
      bar: {
        baz: {
          v2: {
            before: 3,
            after: undefined,
          },
        },
      },
    });
  });

  it("handles empty, unchanged, arrays", function() {
    var a = {
      foo: [],
    };
    var b = {
      foo: [],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [],
    });
  });

  it("handles arrays with objects added", function() {
    var a = {
      foo: [],
    };
    var b = {
      foo: [{
        v: 1,
      }],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        v: {
          before: undefined,
          after: 1,
        },
      }],
    });
  });

  it("handles arrays with objects removed", function() {
    var a = {
      // foo -> []
      foo: [{
        v: 1,
      }],
    };
    var b = {
      foo: [],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        v: {
          before: 1,
          after: undefined,
        },
      }],
    });
  });

  it("handles arrays with changed objects", function() {
    var a = {
      // foo -> [{ v: 2 }]
      foo: [{
        v: 1,
      }, {
        v: 3,
      }],
    };
    var b = {
      foo: [{
        v: 2,
      }, {
        v: 4,
      }],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        v: {
          before: 1,
          after: 2,
        },
      }, {
        v: {
          before: 3,
          after: 4,
        }
      }],
    });
  });

  it("treats objects with different ids in an array as added and removed instead of changed", function() {
    var a = {
      foo: [{
        id: 1,
        v: 'one',
      }],
    };

    var b = {
      foo: [{
        id: 2,
        v: 'two',
      }],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        id: 1,
        v: {
          before: 'one',
          after: undefined,
        },
      }, {
        id: 2,
        v: {
          before: undefined,
          after: 'two',
        },
      }],
    });
  });

  it("supports custom diff id keys", function() {
    var a = {
      foo: [{
        id: 42,       // using custom id, so this is treated as normal key
        customId: 1,
        v: 'one',
      }],
    };

    var b = {
      foo: [{
        id: 43, // using custom id, so this is treated as normal key
        customId: 2,
        v: 'two',
      }],
    };

    // var result = diffJSON(a, b);
    var result = diffJSON(a, b, { diffId: 'customId' });

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        customId: 1,
        id: {
          before: 42,
          after: undefined,
        },
        v: {
          before: 'one',
          after: undefined,
        },
      }, {
        customId: 2,
        id: {
          before: undefined,
          after: 43,
        },
        v: {
          before: undefined,
          after: 'two',
        },
      }],
    });
  });

  it("handles arrays with added, removed and changed objects", function() {
    var a = {
      foo: [{
        id: 1,    // this one is removed
        v: 'one',
      }, {
        id: 2,    // this one is changed (two -> super two)
        v: 'two',
      }],         // we gain { id: 3, v: three}
    };

    var b = {
      foo: [{
        id: 2,
        v: 'super two',
      }, {
        id: 3,
        v: 'three',
      }],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        id: 1,
        v: {
          before: 'one',
          after: undefined,
        },
      }, {
        id: 2,
        v: {
          before: 'two',
          after: 'super two',
        },
      }, {
        id: 3,
        v: {
          before: undefined,
          after: 'three',
        },
      }],
    });
  });

  it("handles added arrays of objects", function() {
    var a = {
      // will gain foo: [{ v: 1 }]
    };
    var b = {
      foo: [{
        v: 1,
      }],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        v: {
          before: undefined,
          after: 1,
        },
      }],
    });
  });

  it("handles removed arrays of objects", function() {
    var a = {
      // will lose foo
      foo: [{
        v: 1,
      }],
    };
    var b = { };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        v: {
          before: 1,
          after: undefined,
        },
      }],
    });
  });

  it("handles arrays of primitives", function() {
    var a = {
      foo: [1, 2, 5],
    };
    var b = { 
      foo: [0, 3, 2],
    };

    var result = diffJSON(a, b);

    assert(Array.isArray(result.foo), 'result.foo is an array');

    assert.deepEqual(result, {
      foo: [{
        before: 1,
        after: 0,
      }, {
        before: 2,
        after: 3,
      }, {
        before: 5,
        after: 2,
      }],
    });
  });
});
