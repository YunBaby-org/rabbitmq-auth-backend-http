import redis from 'redis';
import {appLogger} from './logger';
import {randomBytes} from 'crypto';

export interface AuthenticationToken {
  username: string;
  authcode: string;
}
export interface AuthenticationCode {
  username: string;
  authcode: string;
  timeout: number;
}

export interface AuthenticationManagerParams {
  redisHost: string;
  redisPort: number;
}

/* Singleton global object */
let globalManager: AuthenticationCodeManager | undefined;
export function initAuthenticationCodeManager(
  params: AuthenticationManagerParams
) {
  globalManager = new AuthenticationCodeManager(params);
  globalManager.connect();
  return globalManager;
}
export default function getAuthenticationCodeManager() {
  if (!globalManager) throw Error('global manager is not initilized');
  return globalManager;
}

/**
 * The manager of authentication code
 *
 * @export
 * @class AuthenticationCodeManager
 */
export class AuthenticationCodeManager {
  private params: AuthenticationManagerParams;
  private redisConnection: redis.RedisClient | undefined;

  constructor(params: AuthenticationManagerParams) {
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

  static getAuthCodeKeyname(username: string, authcode: string): string {
    return `auth:user:${username}:${authcode}`;
  }

  async createAuthCode(
    username: string,
    timeouts = 90
  ): Promise<AuthenticationCode> {
    appLogger.debug(
      `User ${username} is creating new auth code with timeout ${timeouts}`
    );
    const token: Buffer = await new Promise(res => res(randomBytes(64)));

    const authcode: AuthenticationCode = {
      username: username,
      authcode: token.toString('base64'),
      timeout: Math.floor(Date.now() / 1000) + timeouts,
    };

    await this.setAuthcodeValue(authcode);

    return authcode;

    /* NOTICE: */
    /* authcode.timeout doesn'consider time timezone, since it only check for the time interval */
    /* Time won't past faster in anywhere at least you stay in the plant. */
    /* But there is one thing you need to consider. DO NOT CHANGE THE time of system. */
    /* or at least make the change a slow process. */
  }

  async consumeAuthCode({
    username,
    authcode,
  }: AuthenticationToken): Promise<boolean> {
    appLogger.debug(`User ${username} is consuming a auth code`, authcode);
    /* Fetch record from redis */
    const timeString = await this.getAuthcodeValue({username, authcode});

    if (timeString) {
      /* if the record is found, determine if the token already expired. */
      const timeExpiry = parseInt(timeString);
      const time0 = Math.floor(Date.now() / 1000);

      /* then we delete this record from database */
      await this.deleteAuthcode({username, authcode});

      return time0 <= timeExpiry;
    }

    return false;
  }

  private async setAuthcodeValue({
    username,
    authcode,
    timeout,
  }: AuthenticationCode) {
    appLogger.debug(`setAuthcodeValue(${username})`);
    return await new Promise((resolve, reject) => {
      this.redisConnection!.set(
        AuthenticationCodeManager.getAuthCodeKeyname(username, authcode),
        timeout.toString(),
        err => (err ? reject(err) : resolve(true))
      );
    });
  }
  private async deleteAuthcode({username, authcode}: AuthenticationToken) {
    appLogger.debug(`deleteAuthcode(${username})`);
    return await new Promise((resolve, reject) => {
      this.redisConnection!.del(
        AuthenticationCodeManager.getAuthCodeKeyname(username, authcode),
        (err, value) => (err ? reject(err) : resolve(value))
      );
    });
  }
  private async getAuthcodeValue({
    username,
    authcode,
  }: AuthenticationToken): Promise<string | null> {
    appLogger.debug(`getAuthcodeValue(${username})`);
    return await new Promise((resolve, reject) => {
      this.redisConnection!.get(
        AuthenticationCodeManager.getAuthCodeKeyname(username, authcode),
        (err, value) => (err ? reject(err) : resolve(value))
      );
    });
  }
}
