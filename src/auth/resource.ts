export interface ResourceRequestParam {
  username: string;
  vhost: string;
  resource: string;
  name: string;
  permission: string;
}
export function authResource(params: ResourceRequestParam): boolean {
  return true;
}
