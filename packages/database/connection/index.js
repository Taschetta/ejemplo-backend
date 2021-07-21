import mysql from 'mysql'

import { configConnection } from './connection.js' 

/**
 * @type mysql.Connection
 */
export let connection 

if(!connection) {
  connection = configConnection({ mysql })
  console.log('Me conecté a la base de datos.')
}