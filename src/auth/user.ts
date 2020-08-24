import getAuthenticationCodeManager from '../authentication-code-manager';

export interface IUserParameter {
  username: string;
  password: string;
}
export function authUser({username, password}: IUserParameter): boolean {
  const authManager = getAuthenticationCodeManager();
  return username.match(/^user/) !== null;
}
