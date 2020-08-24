import redis from 'redis';
import {appLogger} from './logger';
import {randomBytes} from 'crypto';
import {promisify} from 'util';

export interface Iauthcode {
  username: string;
  authcode: string;
  timeout: number;
}

export interface IAuthManagerParams {
  redisHost: string;
  redisPort: number;
}

export default class AuthenticationCodeManager {
  private params: IAuthManagerParams;
  private redisConnection: redis.RedisClient | undefined;

  constructor(params: IAuthManagerParams) {
    this.params = params;
  }

  connect() {
    appLogger.info('Connect to redis server');
    this.redisConnection = redis.createClient(
      this.params.redisPort,
      this.params.redisHost
    );
    this.redisConnection.on('connect', reply => {
      appLogger.info('Connect to redis server successfully.', reply);
    });
    this.redisConnection.on('error', reply => {
      appLogger.error('Connect to redis server failed.', reply);
    });
    this.redisConnection.on('end', reply => {
      appLogger.info('Connect to redis server ended.', reply);
    });
    this.redisConnection.on('ready', reply => {
      appLogger.info('Redis client is ready.', reply);
    });
  }

  async createAuthCode(username: string, timeouts = 90): Promise<Iauthcode> {
    /* Generate an authentication code by securely randomBytes */
    appLogger.debug(`Generate authentication token for user ${username}`);
    const token: Buffer = await new Promise(resolve => {
      resolve(randomBytes(64));
    });
    appLogger.debug(`token generated`, token.toString('base64'));

    /* Wrap it up */
    const authcode: Iauthcode = {
      username: username,
      authcode: token.toString('base64'),
      /* Date.now() return timestamp in millisecond, so divide it by 1000 */
      timeout: Math.floor(Date.now() / 1000) + timeouts,
    };
    appLogger.info(`${Date.now()}`);

    /* NOTICE: */
    /* authcode.timeout doesn'consider time timezone, since it only check for the time interval */
    /* Time won't past faster in anywhere at least you stay in the plant. */
    /* But there is one thing you need to consider. DO NOT CHANGE THE time of system. */
    /* or at least make the change a slow process. */

    /* Store it into the redis */
    appLogger.debug('Save authcode to redis');
    await new Promise((resolve, reject) => {
      this.redisConnection!.set(
        `auth:user:${username}:${authcode}`,
        authcode.timeout.toString(),
        err => (err ? reject() : resolve())
      );
    });
    appLogger.debug('Save authcode to redis successfully');

    /* return the authcode for user */
    return authcode;
  }
}
