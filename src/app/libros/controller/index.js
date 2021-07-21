
export const useController = ({ table }) => ({

  async findMany(filters) {
    return await table.findMany(filters)
  },

  async findOne({ id }) {
    return await table.findOne({ id })
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
  
})