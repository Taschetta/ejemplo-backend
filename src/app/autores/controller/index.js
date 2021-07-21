import { useFormatter } from "./formatter.js"

export const useController = ({ table, libros }) => {
  const formatter = useFormatter({ libros })

  return {
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
  
    async insertOne(item) {
      return await table.insertOne(item)
    },
  
    async updateOne(item) {
      return await table.updateOne(item)
    },
  
    async removeOne({ id }) {
      return await table.removeOne({ id })
    },
  }
  
}