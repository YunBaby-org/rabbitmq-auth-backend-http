import {appLogger} from '../logger';

const AUTH = process.env.AUTH?.toUpperCase();
export const runAsAuthenticationServer =
  AUTH === 'AUTH' || AUTH === undefined || AUTH === 'AUTHN';
export const runAsAuthorizationServer =
  AUTH === 'AUTH' || AUTH === undefined || AUTH === 'AUTHZ';

if (AUTH === undefined) {
  appLogger.warn(
    'The AUTH environment variable is not specified. Both auth server routes will be enable'
  );
}
