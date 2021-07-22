import { ConnectionError, EndConnectionError, QueryError } from "../errors/index.js"

/**
 * 
 * @param {Object} config
 * @param {import("mysql").Connection} config.connection
 */
export const useDatabase = ({ connection }) => ({
  
  async connect() {
    return new Promise((resolve, reject) => {
      connection.connect((error, result) => {
        if(error) reject(new ConnectionError())
        resolve(result)
      })
    })
  },

  async end() {
    return new Promise((resolve, reject) => {
      connection.end((error, result) => {
        if(error) reject(new EndConnectionError())
        resolve(result)
      })
    })
  },

  async query(sql, values) {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, result) => {
        if(error) {
          console.log(error)
          reject(new QueryError())
        }
        resolve(result)
      })
    })
  },

  format(sql, values) {
    return connection.format(sql, values)
  },

  raw(sql) {
    return connection.format(sql)
  }
  
})