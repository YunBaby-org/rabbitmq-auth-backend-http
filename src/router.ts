import express from 'express'
import {authUser, IUserParameter} from './auth/user';
import {authVhost, IVhostParameter} from './auth/vhost';
import {authTopic, ITopicParameter} from './auth/topic';
import {authResource, IResourceParamter} from './auth/resource';

export const userRouter = express.Router();
export const vhostRouter = express.Router();
export const topicRouter = express.Router();
export const resourceRotuer = express.Router();

function answer(bool: boolean) { return bool ? 'allow' : 'deny' }

userRouter.post('/', function postUser(request, response) {
  response.status(200).send(answer(authUser(request.body)))
})

vhostRouter.post('/', function postVhost(request, response) {
  response.status(200).send(answer(authVhost(request.body)))
})

topicRouter.post('/', function postTopic(request, response) {
  response.status(200).send(answer(authTopic(request.body)))
})

resourceRotuer.post('/', function postResource(request, response) {
  response.status(200).send(answer(authResource(request.body)))
})

if(process.env.NODE_ENV !== 'production') {
  /* These route is for testing purpose */
  /* You can test it by browser querystring */
  userRouter.get('/', function getUser(request, response) {
    response.status(200).send(
      answer(authUser(request.query as unknown as IUserParameter))
    )
  })

  vhostRouter.get('/', function getVhost(request, response) {
    response.status(200).send(
      answer(authVhost(request.query as unknown as IVhostParameter))
    )
  })

  topicRouter.get('/', function getTopic(request, response) {
    response.status(200).send(
      answer(authTopic(request.query as unknown as ITopicParameter))
    )
  })

  resourceRotuer.get('/', function getResource(request, response) {
    response.status(200).send(
      answer(authResource(request.query as unknown as IResourceParamter))
    )
  })
}
