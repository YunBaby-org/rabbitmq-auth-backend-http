import AuthenticationCodeManager from '../authentication-code-manager';
import {isProduction} from '../utility/isProduction';

export interface IAuthenticateRequestParameter {
  username: string;
}

/* Authentication Manager */
const authCodeManager = new AuthenticationCodeManager({
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),
});

authCodeManager.connect();
export default async function createAuthenticationCode(
  params: IAuthenticateRequestParameter
) {
  /* Implement your extra authenticate login here */
  if (isProduction) {
    return await authCodeManager.createAuthCode(params.username, 90);
  } else {
    return await authCodeManager.createAuthCode(params.username, 30 * 60);
  }
}
