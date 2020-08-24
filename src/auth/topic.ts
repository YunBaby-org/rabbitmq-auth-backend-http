export interface ITopicParameter {
  username: string;
  vhost: string;
  resource: string;
  name: string;
  permission: string;
  routing_key: string;
}
export function authTopic(params: ITopicParameter): boolean {
  return true;
}
