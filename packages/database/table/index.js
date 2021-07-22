import { useBuilder } from './builder.js'

export const useTable = ({ database }) => ({ name: table }) => {
  const builder = useBuilder({ database })
  return {

    async query(statements) {
      const sql = builder(statements)
      return await database.query(sql)
    },
    
    // find

    async findOne(filters, { fields, sort_by, sort_order } = {}) {
      let result
      
      result = await this.query({
        $select: {
          table,
          fields,
        },
        $where: filters,
        $order: {
          field: sort_by,
          order: sort_order,
        },
        $limit: 1
      })

      return result[0] || undefined
    },

    async findMany(filters, { fields, sort_by, sort_order, paginate, page_size = process.env.PAGE_SIZE, page = 1 } = {}) {
      let result = {}
      
      result = await this.query({
        $select: {
          table,
          fields
        },
        $where: filters,
        $order: {
          field: sort_by,
          order: sort_order,
        },
        $limit: paginate && page_size,
        $offset: paginate && (page - 1) * page_size,
      })

      return result
    },

    // insert

    async insertOne(item) {
      let result, entries
      
      item = this.clean(item)
      entries = Object.entries(item)
      
      result = await this.query({
        $insert: {
          table,
          fields: entries.map(([key, value]) => key),
          values: entries.map(([key, value]) => value),
        }
      })

      result = await this.findOne({ id: result.insertId })

      return result
    },

    async insertMany(items) {
      let result

      result = await this.query({
        $insert: {
          table,
          fields: Object.keys(items[0]),
          values: items.map(item => Object.values(item))
        }
      })

      result = await this.query({
        $select: { table },
        $where: {
          id: { $raw: { $gte: 'last_insert_id()' } }
        } 
      })

      return result
    },

    // update

    async updateOne(filters, update, options = {}) {
      let result
      
      result = await this.query({
        $update: {
          table,
          set: this.clean(update),
        },
        $where: filters,
        $order: {
          field: options.sort_by,
          order: options.sort_order,
        },
        $limit: 1,
      })

      result = await this.findOne(filters)

      return result
    },

    async updateMany(filters, update, options = {}) {
      let result
      
      result = await this.query({
        $update: {
          table,
          set: this.clean(update),
        },
        $where: filters,
        $order: {
          field: options.sort_by,
          order: options.sort_order,
        },
      })

      result = await this.findMany(filters)

      return result
    },

    // upsert


    async upsertOne({ id, ...item }) {
      return (id)
        ? await this.updateOne({ id }, item)
        : await this.insertOne(item)
    },

    async upsertMany(items) {
      items = items.map(item => this.upsertOne(item))
      items = await Promise.all(items)
      return items
    },

    // remove

    async removeOne(filters, options = {}) {
      const result = await this.query({
        $remove: {
          table,
        },
        $where: filters,
        $order: {
          field: options.sort_by,
          order: options.sort_order,
        },
        $limit: 1
      })
      
      return {
        removedCount: result.affectedRows
      }
    },

    async removeMany(filters, options = {}) {
      const result = await this.query({
        $remove: {
          table,
        },
        $where: filters,
        $order: {
          field: options.sort_by,
          order: options.sort_order,
        },
      })
      
      return {
        removedCount: result.affectedRows
      } 
    },

    // utilities

    clean(value) {
      value = Object.entries(value)
      value = value.filter(([key, value]) => (!!value || typeof value === 'boolean') && typeof value != 'object')
      value = Object.fromEntries(value)
      return value
    },
    
    async count(filters) {
      const result = await this.query({
        $select: {
          table,
          count: true
        },
        $where: filters
      })

      return result[0]['COUNT(*)']
    },

    async columns({ ignore = ['created_at', 'updated_at'] } = {}) {
      let result
      result = await database.query('SHOW COLUMNS FROM ??', [ table ])
      result = result.filter(column => !ignore.includes(column.Field))
      return result
    },

    async exists(filters) {
      let item = await this.findOne(filters)
      return (item) ? true : false
    },
    
    async pagination(filters, { page_size = process.env.PAGE_SIZE, page = 1 } = {}) {
      let result = {}
      let count

      count = await this.count(filters)
      
      result.page = page
      result.total_items = count
      result.total_pages = Math.ceil(count / page_size)
      
      return result
    },

  }
  
}