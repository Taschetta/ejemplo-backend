
export const forEach = (object, callback) => {
  Object.entries(object).forEach(([key, value]) => {
    callback(key, value)
  })
}