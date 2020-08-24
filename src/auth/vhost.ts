export interface IVhostParameter {
  username: string;
  vhost: string;
  ip: string;
}
export function authVhost({username, vhost, ip}: IVhostParameter): boolean {
  return username.match(/^user/) !== null && vhost === '/user';
}
