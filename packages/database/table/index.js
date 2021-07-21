import { object } from '@packages/helpers'

// Referencia: https://www.npmjs.com/package/mysql#performing-queries

export const useTable = ({ database }) => ({ name }) => ({

  async query(sql, values) {
    return await database.query(sql, values)    
  },
  
  async findOne(filters) {
    let sql = [], result
    
    sql.push(database.format('SELECT * FROM ??', [name]))    
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
    
    sql.push(database.format('SELECT * FROM ??', [name]))    
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
      name,
      Object.keys(item),
      Object.values(item),
    ])

    result = await this.findOne({ id: result.insertId })

    return result
  },

  async updateOne({ id, ...item }) {
    let result

    result = await this.query('UPDATE ?? SET ? WHERE `id` = ? LIMIT 1', [ name, item, id ])

    result = await this.findOne({ id })

    return result    
  },

  async upsertOne(item) {
    return (item.id)
      ? await this.updateOne(item)
      : await this.insertOne(item)
  },

  async removeOne({ id }) {
    let result
    
    result = await this.query('DELETE FROM ?? WHERE `id` = ? LIMIT 1', [ name, id ])

    return {
      removedRows: result.affectedRows
    }
  },
  
})