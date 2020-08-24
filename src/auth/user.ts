export interface IUserParameter {
  username: string;
  password: string;
}
export function authUser({username, password}: IUserParameter): boolean {
  return username.match(/^user/) !== null;
}
