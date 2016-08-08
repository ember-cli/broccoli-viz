module.exports = {
  isPrimitive: function isPrimitive(value) {
    var type = typeof value;
    return value === null || (
        type !== 'object' &&
        type !== 'undefined'
      );
  },
};
