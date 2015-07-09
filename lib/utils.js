export function extend(obj /* , ...source */) {
  for (let i = 1; i < arguments.length; i++) {
    for (let key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }
  return obj;
}

export function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}
