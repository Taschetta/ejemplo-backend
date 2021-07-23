import { object } from '@packages/helpers'
/**
 * 
 * @param {Object} config
 * @param {import("express")} config.express
 */
export const configApp = ({ express, handler }) => (routes = {}) => {
  const app = express()

  addMiddleware()
  addRoutes(routes)
  addDefaultRoutes()
  
  return app

  function addMiddleware() {
    
    app.use(express.json())    
    app.use(cors)

    function cors(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
      next()
    }
  }

  function addRoutes(routes) {
    object.forEach(routes, (route, value) => {
      return (value.name == 'router')
        ? addRouter(route, value)
        : addMethods(route, value)
    })

    function addRouter(route, router) {
      app.use(route, router)
    }

    function addMethods(route, value) {
      object.forEach(value, (method, callback) => {
        app[method](route, handler(callback))
      })
    }
  }

  function addDefaultRoutes() {
    addRouteNotFound()

    function addRouteNotFound() {
      app.all('*', (req, res) => {
        res
          .status(404)
          .send({
            success: false,
            message: `La ruta ${req.path} no existe`
          })
      })
    }
  }
}