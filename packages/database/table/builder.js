
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
      const statements = {
        
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

      let result = 
        Object
          .entries(filters)
          .map(toFilters)
          .map(toStatement)
          .join(' AND ')
        
      return result && 'WHERE ' + result

      function toFilters([colum, filter]) {
        switch (typeof filter) {
          case 'string':
            return [colum, { $like: filter }]

          case 'number':
            return [colum, { $exact: filter }]

          case 'boolean':
            return [colum, { $exact: filter }]

          case 'object':
            return [colum, filter]

          default:
            throw new Error(`Default filter for type ${typeof filter} not implemented`)
        }
      }

      function toStatement([column, filters]) {
        return (
          Object
            .entries(filters)
            .map(([filter, value]) => 
              statements[filter](column, value)
            )
        )
      }

      function formatValue(value) {
        if(options.raw)
          value = database.raw(value)

        return value
      }
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

  return (query) => 
    Object
      .entries(query)
      .map(toStatement)
      .filter(isValid)
      .join(' ')

  function toStatement([key, value]) {
    return value && statements[key](value)
  }

  function isValid(statement) {
    return !!statement
  }
}