Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
exports.isFunction = isFunction;
function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }
  return obj;
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}