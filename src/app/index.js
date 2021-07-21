import { makeApp } from '@packages/router'

import { router as autores } from './autores/index.js'
import { router as libros } from './libros/index.js'

export default makeApp({
  '/autores': autores,
  '/libros': libros,
  '/': {
    get: () => {
      return {
        success: true,
        message: 'Bienvenido a la API ejemplo-backend'
      }
    }
  },
})