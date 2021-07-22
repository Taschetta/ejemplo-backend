
export const useFormatter = () => ({

  cleanOne({ id = 0, titulo, fkAutor }) {
    return {
      id,
      titulo,
      fkAutor,
    }
  },

  cleanMany(items, globals) {
    items = items.map(item => ({ ...item, ...globals }))
    items = items.map(item => this.cleanOne(item))
    return items
  },
  
})