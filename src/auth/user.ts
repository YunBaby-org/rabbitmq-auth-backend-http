import getAuthenticationCodeManager from '../authentication-code-manager';

export interface IUserParameter {
  username: string;
  password: string;
}
export async function authUser({username, password}: IUserParameter) {
  const authManager = getAuthenticationCodeManager();
  return await authManager.consumeAuthCode({
    username: username,
    authcode: password,
  });
}
