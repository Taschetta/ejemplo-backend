
export class EnvMissingError extends Error {
  constructor(name) {
    super(`Missing enviroment variable ${name}`)
    this.name = 'EnvMissingError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvMissingError)
    }
  }
}

export class ConnectionError extends Error {
  constructor() {
    super(`Se produjo un error al conectarse a la base de datos`)
    this.type = 'DatabaseError'
    this.name = 'ConnectionError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, ConnectionError)
    }
  }
}

export class EndConnectionError extends Error {
  constructor() {
    super(`Se produjo un error al terminar la coneccion con la base de datos`)
    this.type = 'DatabaseError'
    this.name = 'EndConnectionError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, EndConnectionError)
    }
  }
}

export class QueryError extends Error {
  constructor() {
    super(`Se produjo un error al traer los datos de la base de datos`)
    this.type = 'DatabaseError'
    this.name = 'QueryError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, QueryError)
    }
  }
}