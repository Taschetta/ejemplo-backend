import { useTable } from '@packages/database'
import { libros } from './modules/index.js'
import { useController } from './controller/index.js'
import { useEndpoint } from './endpoint/index.js'
import { useRouter } from './router/index.js'

export const table = useTable({ name: 'autor' })
export const controller = useController({ table, libros })
export const endpoint = useEndpoint({ controller })
export const router = useRouter({ endpoint })