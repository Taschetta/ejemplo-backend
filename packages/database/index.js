import { connection } from './connection/index.js'
import { useDatabase } from './database/index.js'
import { useTable as configTable } from './table/index.js'

export const database = useDatabase({ connection })
export const useTable = configTable({ database })