import { makeRouter } from '@packages/router'

export const useRouter = ({ endpoint }) => makeRouter({
  '/': {
    get: endpoint.findMany,
    post: endpoint.insertOne,
  },
  '/:id': {
    get: endpoint.findOne,
    patch: endpoint.updateOne,
    delete: endpoint.removeOne,
  }
})