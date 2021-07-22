
export const useBuilder = ({ database }) => {
  const statements = {

    $select({ table, count, fields }) {
      return count 
        ? database.format('SELECT COUNT(*) FROM ??', [table])
        : fields 
          ? database.format('SELECT ?? FROM ??', [fields, table])
          : database.format('SELECT * FROM ??', [table])
    },

    $insert({ table, fields, values }) {
      if(!Array.isArray(values[0]))
        values = [values]

      return database.format('INSERT INTO ?? (??) VALUES ?', [table, fields, values])
    },

    $update({ table, set }) {
      return database.format('UPDATE ?? SET ?', [table, set])
    },

    $remove({ table }) {
      return database.format('DELETE FROM ??', [table])
    },

    $where(filters, options = { negate: false, raw: false }) {   
      
      const formatValue = (value) => {
        if(options.raw)
          value = database.raw(value)

        return value
      }
      
      const statements = {
        //cambiar a equal
        $exact: (column, value) => {
          let sql = options.negate ? '?? != ?' : '?? = ?'
          return database.format(sql, [column, formatValue(value)])
        },
        $gte: (column, value) => {
          let sql = options.negate ? '?? < ?' : '?? >= ?'
          
          return database.format(sql, [column, formatValue(value)])
        },
        $in: (column, values) => {
          let sql = options.negate ? '?? NOT IN (?)' : '?? IN (?)'

          if(!values || !values.length)
            return undefined

          if(typeof values[0] == 'object')
            values = values.map(value => value[column])
          
          return database.format(sql, [column, formatValue(values)])
        },
        $like: (column, value) => {
          let sql = options.negate ? '?? NOT LIKE ?' : '?? LIKE ?'
          value = `%${value}%`
          return database.format(sql, [column, formatValue(value)]) 
        },
        $not: (column, value) => {
          return this.$where({ [column]: value }, { negate: true }).replace('WHERE ', '')
        },
        $raw: (column, value) => {
          return this.$where({ [column]: value }, { raw: true }).replace('WHERE ', '')
        }
      }

      const toStatement = ([column, filters]) => {
        return Object
          .entries(filters)
          .map(([key, value]) => statements[key](column, value))
      }

      const parse = ([key, value]) => {
        switch (typeof value) {
          case 'string':
            return [key, { $like: value }]

          case 'number':
            return [key, { $exact: value }]

          case 'boolean':
            return [key, { $exact: value }]

          case 'object':
            return [key, value]

          default:
            throw new Error(`Default filter for type ${typeof value} not implemented`)
        }
      }

      const entries = Object.entries(filters)
      
      if(!entries.length)
        return

      let result = entries
      .map(parse)
      .map(toStatement)
      .join(' AND ')
        
      return result && 'WHERE ' + result
    },

    $order({ field, order = 'ASC' }) {
      return field && (
        order.toLowerCase() === 'asc'
          ? database.format('ORDER BY ?? ASC', [field])
          : database.format('ORDER BY ?? DESC', [field])
      )
    },

    $limit(value) {
      return database.format('LIMIT ?', [parseInt(value)])
    },

    $offset(value) {
      return database.format('OFFSET ?', [parseInt(value)])
    },
    
  }

  const toStatement = ([key, value]) => {
    return value && statements[key](value)
  }

  const generate = (query) => {
    return Object.entries(query)
      .map(toStatement)
      .filter(statements => !!statements)
      .join(' ')
  }

  return (query) =>{
    return generate(query)
  }
}