
export const useEndpoint = ({ controller }) => ({
  
  async findMany({ request }) {
    const filters = request.query
    const items = await controller.findMany(filters)
    return {
      success: true,
      items,
    }
  },
  
  async findOne({ request }) {
    const id = request.params.id
    const item = await controller.findOne({ id })
    return {
      success: true,
      item,
    }
  },
  
  async insertOne({ request }) {
    let item
    item = request.body
    item = await controller.insertOne(item)
    return {
      success: true,
      item
    }
  },
  
  async updateOne({ request }) {
    let id, item
    
    id = request.params.id
    item = request.body
    
    item = await controller.updateOne({ id, ...item })    
    
    return {
      success: true,
      item
    }
  },

  async removeOne({ request }) {
    const id = request.params.id
    const result = await controller.removeOne({ id })
    return {
      success: true,
      result,
    }
  },
  
})