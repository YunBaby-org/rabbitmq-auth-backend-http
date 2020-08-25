import express from 'express';
import bodyParser from 'body-parser';
import {expressLogger, expressErrorLogger, appLogger} from './logger';
import {userRouter, vhostRouter, resourceRotuer, topicRouter} from './router';
import {authcodeRouter} from './authRouter';
import {initAuthenticationCodeManager} from './authentication-code-manager';

async function setup() {
  const app = express();
  const port = parseInt(process.env.PORT || '3000');
  const hostname = process.env.hostname || '0.0.0.0';

  /* Initialize authentication code manager */
  initAuthenticationCodeManager({
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379'),
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressLogger);

  /* rotuer goes here */
  app.use('/auth/user', userRouter);
  app.use('/auth/vhost', vhostRouter);
  app.use('/auth/topic', topicRouter);
  app.use('/auth/resource', resourceRotuer);
  app.use('/authentication', authcodeRouter);
  /* router ends here */

  app.use(expressErrorLogger);
  app.listen(port, hostname, () => {
    appLogger.info(`Application listen at port ${port}.`);
  });
}

if (require.main === module) {
  setup();
}
