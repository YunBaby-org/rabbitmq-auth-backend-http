import getAuthenticationCodeManager from '../authentication-code-manager';
import {isProduction} from '../utility/isProduction';

export interface AuthenticateRequestParam {
  username: string;
}

export default async function createAuthenticationCode(
  params: AuthenticateRequestParam
) {
  /* Implement your extra authenticate login here */
  if (isProduction) {
    return await getAuthenticationCodeManager().createAuthCode(
      params.username,
      90
    );
  } else {
    return await getAuthenticationCodeManager().createAuthCode(
      params.username,
      30 * 60
    );
  }
}
