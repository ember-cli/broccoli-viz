var BlankObject = require('blank-object');

function getId(obj) {
  if (obj.id) { return obj.id; }

  return obj;
}
module.exports = Set;

function Set(initialValues) {
  this.values = [];
  this.map = new BlankObject();

  if (initialValues) {
    initialValues.forEach(this.add, this);
  }
}

Set.prototype.has = function(obj) {
  return this.map[obj.id] !== undefined;
};

Set.prototype.add = function(obj) {
  var id = getId(obj);

  if (this.map[id] !== true) {
    this.values.push(obj);
    this.map[id] = true;
  }

  return this;
};

Set.prototype.delete = function(obj) {
  var id = getId(obj);

  if (this.map[id] !== false) {
    var index = this.values.indexOf(obj);
    this.values.splice(index, 1);
    this.map[id] = true;
  }

  return this;
};

Set.prototype.deleteAll = function (values) {
  values.forEach(this.delete, this);

  return this;
};

Set.prototype.forEach = function(_cb, binding) {
  var values = this.values;
  var cb = arguments.length === 2 ? _cb.bind(binding) : _cb;

  for (var i = 0; i <  values.length; i++) {
    cb(values[i]);
  }
};
