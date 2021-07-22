import { object } from '@packages/helpers'
import { useBuilder } from './builder.js'

// Referencia: https://www.npmjs.com/package/mysql#performing-queries

export const useTable = ({ database }) => ({ name: table }) => {
  const builder = useBuilder({ database, table })

  return {
    async query(sql, values) {
      return await database.query(sql, values)    
    },
    
    async findOne(filters) {
      let sql = [], result
      
      sql.push(database.format('SELECT * FROM ??', [table]))    
      sql.push(addFilters(filters))
      sql.push('LIMIT 1')

      sql = sql.join(' ')

      result = await this.query(sql)
      
      return result[0]
      
      function addFilters(filters) {
        let sql = []

        object.forEach(filters, (column, value) => {
          sql.push(database.format('?? LIKE ?', [column, value]))
        })

        return sql.length > 0
          ? 'WHERE ' + database.format(sql.join(' AND '))
          : ''
      }
    },

    async findMany(filters = {}) {
      let sql = [], result
      
      sql.push(database.format('SELECT * FROM ??', [table]))    
      sql.push(addFilters(filters))

      sql = sql.join(' ')

      result = await this.query(sql)

      return result

      function addFilters(filters) {
        let sql = []

        object.forEach(filters, (column, value) => {
          sql.push(database.format('?? LIKE ?', [column, value]))
        })

        return sql.length > 0
          ? 'WHERE ' + database.format(sql.join(' AND '))
          : ''
      }    
    },

    async insertOne(item) {
      let result 
      
      result = await this.query('INSERT INTO ?? (??) VALUES (?)', [
        table,
        Object.keys(item),
        Object.values(item),
      ])

      result = await this.findOne({ id: result.insertId })

      return result
    },

    async insertMany(items) {
      items = items.map(item => this.insertOne(item))
      items = await Promise.all(items)
      return items
    },

    async updateOne({ id, ...item }) {
      let result

      result = await this.query('UPDATE ?? SET ? WHERE `id` = ? LIMIT 1', [ table, item, id ])

      result = await this.findOne({ id })

      return result    
    },

    async updateMany(items) {
      items = items.map(item => this.updateOne(item))
      items = await Promise.all(items)
      return items
    },

    async upsertOne(item) {
      return (item.id)
        ? this.updateOne(item)
        : this.insertOne(item)
    },

    async upsertMany(items) {
      items = items.map(item => this.upsertOne(item))
      items = await Promise.all(items)
      return items
    },

    async removeOne({ id }) {
      let result
      
      result = await this.query('DELETE FROM ?? WHERE `id` = ? LIMIT 1', [ table, id ])

      return {
        removedRows: result.affectedRows
      }
    },

    async removeMany(filters) {
      let sqlDelete = 'DELETE * FROM ?'
      let sqlWhere = Object.entries(filters).map(([key, value]) => {

      })
    }
  }
  
}