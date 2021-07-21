import { useTable } from '@packages/database'
import { useController } from './controller/index.js'
import { useEndpoint } from './endpoint/index.js'
import { useRouter } from './router/index.js'

export const table = useTable({ name: 'libro' })
export const controller = useController({ table })
export const endpoint = useEndpoint({ controller })
export const router = useRouter({ endpoint })