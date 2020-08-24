import getAuthenticationCodeManager from '../authentication-code-manager';
import {isProduction} from '../utility/isProduction';

export interface IAuthenticateRequestParameter {
  username: string;
}

export default async function createAuthenticationCode(
  params: IAuthenticateRequestParameter
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
