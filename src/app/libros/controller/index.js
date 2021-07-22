import { useFormatter } from "./formatter.js"

export const useController = ({ table }) => {
  const formatter = useFormatter()

  return {
    async findMany(filters) {
      return await table.findMany(filters)
    },
  
    async findOne(filters) {
      return await table.findOne(filters)
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