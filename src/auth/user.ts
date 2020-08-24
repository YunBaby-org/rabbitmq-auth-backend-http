import getAuthenticationCodeManager from '../authentication-code-manager';

export interface UserRequestParam {
  username: string;
  password: string;
}
export async function authUser({username, password}: UserRequestParam) {
  const authManager = getAuthenticationCodeManager();
  return await authManager.consumeAuthCode({
    username: username,
    authcode: password,
  });
}
