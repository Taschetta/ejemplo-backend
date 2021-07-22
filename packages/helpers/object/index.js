
export function forEach (object, callback) {
  Object
    .entries(object)
    .forEach(([key, value]) => {
      callback(key, value)
    })
}

export function map(object, callback) {
  return Object
    .entries(object)
    .map(([key, value]) => {
      return callback(key, value)
    })
}

export function reduce(object, callback, initialValue) {
  return Object
    .entries(object)
    .reduce((previousValue, [key, value]) => {
      return callback(previousValue, key, value)
    }, initialValue)
}