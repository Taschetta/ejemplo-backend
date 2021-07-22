
export const useFormatter = () => ({

  cleanOne({ id = 0, nombre }) {
    return {
      id,
      nombre,
    }
  },

  cleanMany(items, globals) {
    items = items.map(item => ({ ...item, ...globals }))
    items = items.map(item => this.cleanOne(item))
    return items
  },
  
})