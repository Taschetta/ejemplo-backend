import { EnvMissingError } from "../errors/index.js"

// Referenca: https://www.npmjs.com/package/mysql#establishing-connections

/**
 * @param { Object } config
 * @param { import('mysql') } config.mysql
 * @returns { import('mysql').Connection }
 */
export const configConnection = ({ mysql }) => {
  
  checkEnv()

  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })

  function checkEnv () {
    const vars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE']
    vars.map(name => {
      if(!process.env[name])
        throw new EnvMissingError(name)
    })  
  }
  
}