
export const useFormatter = ({ libros }) => ({

  cleanOne({ id = 0, nombre, pais } = {}) {
    return {
      id,
      nombre,
      pais,
    }
  },

  cleanMany(items) {
    items = items.map(item => this.cleanOne(item))
    return items
  },
  
  async fillOne(item) {
    item = this.cleanOne(item)
    item.libros = await libros.findMany({ fkAutor: item.id })
    return item
  },

  async fillMany(items) {
    items = items.map(item => this.fillOne(item))
    items = await Promise.all(items)
    return items
  },
  
})