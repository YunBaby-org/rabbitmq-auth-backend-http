export interface VhostRequestParam {
  username: string;
  vhost: string;
  ip: string;
}
export function authVhost({username, vhost, ip}: VhostRequestParam): boolean {
  return username.match(/^user/) !== null && vhost === '/user';
}
