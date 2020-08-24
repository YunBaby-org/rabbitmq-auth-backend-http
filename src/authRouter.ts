import express from 'express';
import createAuthenticationCode from './auth/authentication';
import {errorResponse, successResponse} from './utility/response';

export const authcodeRouter = express.Router();

authcodeRouter.use((request, response, next) => {
  /* TODO: check if JWT correct here */

  /* check if username is here */
  if (!(request.body && request.body.username)) {
    response.status(400).send(errorResponse('username is not specified'));
    return;
  }

  next();
});

// TODO: Hook this route with jwt authentication
authcodeRouter.post('/', async (request, response) => {
  if (process.env.NODE_ENV !== 'production') {
    const crendential = await createAuthenticationCode({
      username: request.body.username as string,
    });
    response.status(200).send(successResponse(crendential));
  } else {
    response
      .status(401)
      .send(errorResponse('JWT authentication is not implement yet'));
  }
});
