export interface IResourceParamter {
  username: string;
  vhost: string;
  resource: string;
  name: string;
  permission: string;
}
export function authResource(params: IResourceParamter): boolean {
  return true;
}
