import { object } from '@packages/helpers'
/**
 * 
 * @param {Object} config
 * @param {import("express")} config.express
 */
export const configRouter = ({ express, handler }) => (routes = {}) => {
  const router = express.Router()
  
  addRoutes(routes)

  return router

  function addRoutes(routes) {
    object.forEach(routes, addRoute)
    
    function addRoute(route, value) {
      
      return (value.name == 'router')
        ? addRouter(route, value)
        : addMethods(route, value)
    }

    function addRouter(route, newRouter) {
      router.use(route, newRouter)
    }

    function addMethods(route, value) {
      object.forEach(value, addMethod)
      
      function addMethod(method, callback) {
        router[method](route, handler(callback))
      }
    }
  }
}