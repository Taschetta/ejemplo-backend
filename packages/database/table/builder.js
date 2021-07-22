import { object } from '@packages/helpers'

export const useBuilder = ({ database, table }) => (query) => {
  const statements = {

    $select() {
      return {
        sql: 'SELECT * FROM ??', 
        values: [ table ]
      }
    },

    $insert({ fields, values }) {
      if(!Array.isArray(values[0]))
        values = [values]

      return {
        sql: 'INSERT INTO ?? (??) VALUES ?', 
        values: [ table, fields, values ]
      }
    },

    $update({ set }) {
      return {
        sql: 'UPDATE ?? SET ?', 
        values: [ table, set ]
      }
    },

    $remove() {
      return {
        sql: 'DELETE FROM ??', 
        values: [ table ]
      }
    },

    $where(filters) {
      const statements = {
        $equal(column, value) {

        },
        $like() {
          
        },
        $in() {

        },
        $not() {

        },
        $raw() {

        }
      }

      const result = object.reduce(filters, (result, column, value) => {
        switch (typeof value) {
          case 'object':
            object.forEach(value, (statement, value) => {
              filters.push(statements[statement](column, value))
            })
            break;
          case 'string':
            filters.push(statements.$like())
            break;
          case 'number':
            
            break;
        
          default:
            break;
        }
      }, [])
    }
  }

  object.map(query, (key, value) => {

  })
}