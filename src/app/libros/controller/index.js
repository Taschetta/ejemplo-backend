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

    async insertMany(items, globals) {
      items = formatter.cleanMany(items, globals)
      items = await table.insertMany(items)
      return items
    },
  
    async updateOne(filters, update) {
      return await table.updateOne(filters, update)
    },

    async updateMany(filters, update) {
      return await table.updateMany(filters, update)
    },

    async upsertOne(item) {
      return await table.upsertOne(item)
    },

    async upsertMany(items, globals){
      items = formatter.cleanMany(items, globals) 
      items = await table.upsertMany(items)
      return items
    },
  
    async removeOne(filters) {
      return await table.removeOne(filters)
    },

    async removeMany(filters) {
      return await table.removeMany(filters)
    }
    
  }  
}