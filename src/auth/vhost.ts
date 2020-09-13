import {appLogger} from '../logger';

export interface VhostRequestParam {
  username: string;
  vhost: string;
  ip: string;
}
export function authVhost({username, vhost, ip}: VhostRequestParam): boolean {
  return vhost === '/';
}
