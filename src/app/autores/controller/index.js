import { useFormatter } from "./formatter.js"

export const useController = ({ table, libros }) => {
  const formatter = useFormatter({ libros })

  return {

    libros,
    
    async findMany(filters) {
      let items

      items = await table.findMany(filters)
      items = await formatter.fillMany(items)

      return items
    },
  
    async findOne({ id }) {
      let item
      
      item = await table.findOne({ id })
      item = await formatter.fillOne(item)

      return item
    },
  
    async insertOne({ libros, ...item }) {
      item = await table.insertOne(item)
      items.libros = await this.libros.insertMany(libros, { fkAutor: item.id })
      return item
    },
  
    async updateOne({ libros, ...item }) {
      item = await table.updateOne(item)
      
      item.libros = await this.libros.upsertMany(libros, { fkAutor: item.id })
      
      await this.libros.remove({ fkAutor: item.id, id: { $not: { $in: libros } } })

      return item
    },
  
    async removeOne({ id }) {
      return await table.removeOne({ id })
    },
  }
  
}