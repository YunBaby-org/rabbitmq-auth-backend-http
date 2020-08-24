export interface TopicRequestParam {
  username: string;
  vhost: string;
  resource: string;
  name: string;
  permission: string;
  routing_key: string;
}
export function authTopic(params: TopicRequestParam): boolean {
  return true;
}
