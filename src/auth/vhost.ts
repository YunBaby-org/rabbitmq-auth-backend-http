import {appLogger} from '../logger';

export interface VhostRequestParam {
  username: string;
  vhost: string;
  ip: string;
}
export function authVhost({username, vhost, ip}: VhostRequestParam): boolean {
  if (vhost === 'user') return true;
  const [name, name_vhost] = username.split(':');
  if (typeof name !== 'string' || typeof vhost !== 'string') {
    appLogger.debug('Failed to claim vhost , bad username - ' + username);
    return false;
  }
  if (vhost !== name_vhost) {
    appLogger.debug('Failed to claim vhost, vhost not match');
    return false;
  }
  return true;
}
