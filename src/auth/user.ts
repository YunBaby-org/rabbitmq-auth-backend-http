import jwt from 'jsonwebtoken';
import getAuthenticationCodeManager from '../authentication-code-manager';
import JwtManager from '../utility/JwtManager';
import {appLogger} from '../logger';

export interface MobileJwt {
  trackerId: string;
  permission: {
    vhost: [string];
  };
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
  jti: string;
}

export interface UserRequestParam {
  username: string;
  password: string;
}

export async function authUser({username, password}: UserRequestParam) {
  const authManager = getAuthenticationCodeManager();
  /* If this is Jwt token, verify with Jwt route */
  if (isJwtPassword(username, password)) {
    appLogger.debug('Authenticate by JWT token');
    return await authByJwt(username, password);
  } else {
    appLogger.debug('Authenticate by authentication code');
    return await authManager.consumeAuthCode({
      username: username,
      authcode: password,
    });
  }
}

async function isJwtPassword(username: string, token: string) {
  const jwt = JwtManager.mobileTokenVerifier.decode(token) as MobileJwt;
  if (jwt === null) return false;
  if (typeof jwt !== 'object') return false;
  if (typeof jwt.trackerId !== 'string') return false;
  if (typeof jwt.permission !== 'object') return false;
  if (typeof jwt.permission.vhost !== 'object') return false;
  if (jwt.permission.vhost.constructor !== Array) return false;

  return true;
}

async function authByJwt(username: string, token: string) {
  try {
    /* Test if the JWT token is distributed by Mobile authentication server */
    const jwt = JwtManager.mobileTokenVerifier.verify(token) as MobileJwt;
    console.log(jwt);
    if (jwt === null) {
      appLogger.debug('Invalid JWT');
      return false;
    }
    /* Test if the user put the claiming vhost in username */
    /* For some limit of RabbitMQ HTTP backend, we have to make the username like */
    /* username:vhost */
    const [name, audience] = username.split(':');
    if (typeof name !== 'string' || typeof audience !== 'string') {
      appLogger.debug('Bad username');
      return false;
    }
    /* The username must match the value in JWT field */
    if (name !== jwt.sub) {
      appLogger.debug('Incorrect subject');
      return false;
    }
    /* The audience must match the second part of username */
    if (audience !== jwt.aud) {
      appLogger.debug('Incorrect audience');
      return false;
    }
    /* the vhost claim must in permission array */
    if (!jwt.permission.vhost.includes('/')) {
      appLogger.debug('No JWT vhost / permission');
      return false;
    }
    /* OK */
    return true;
  } catch (e) {
    appLogger.error(e);
    appLogger.error('Unexpected error during handle JWT authentication');
    return false;
  }
}
