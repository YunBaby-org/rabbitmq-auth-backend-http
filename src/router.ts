import express from 'express';
import {authUser, UserRequestParam} from './auth/user';
import {authVhost, VhostRequestParam} from './auth/vhost';
import {authTopic, TopicRequestParam} from './auth/topic';
import {authResource, ResourceRequestParam} from './auth/resource';

export const userRouter = express.Router();
export const vhostRouter = express.Router();
export const topicRouter = express.Router();
export const resourceRotuer = express.Router();

function answer(bool: boolean) {
  return bool ? 'allow' : 'deny';
}

userRouter.post('/', async (request, response) => {
  response.status(200).send(answer(await authUser(request.body)));
});

vhostRouter.post('/', (request, response) => {
  response.status(200).send(answer(authVhost(request.body)));
});

topicRouter.post('/', (request, response) => {
  response.status(200).send(answer(authTopic(request.body)));
});

resourceRotuer.post('/', (request, response) => {
  response.status(200).send(answer(authResource(request.body)));
});

if (process.env.NODE_ENV !== 'production') {
  /* These route is for testing purpose */
  /* You can test it by browser querystring */
  userRouter.get('/', async (request, response) => {
    response
      .status(200)
      .send(
        answer(await authUser((request.query as unknown) as UserRequestParam))
      );
  });

  vhostRouter.get('/', (request, response) => {
    response
      .status(200)
      .send(answer(authVhost((request.query as unknown) as VhostRequestParam)));
  });

  topicRouter.get('/', (request, response) => {
    response
      .status(200)
      .send(answer(authTopic((request.query as unknown) as TopicRequestParam)));
  });

  resourceRotuer.get('/', (request, response) => {
    response
      .status(200)
      .send(
        answer(authResource((request.query as unknown) as ResourceRequestParam))
      );
  });
}
