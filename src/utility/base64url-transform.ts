/* These functions encode/decode a base64 into url safe form */
/* https://stackoverflow.com/a/5835352/8319496 */

import {appLogger} from '../logger';

export function encodeUrlSafeBase64(base64: string): string {
  return base64.replace(/[+]/g, '.').replace(/[\/]/g, '_').replace(/[=]/g, '-');
}

export function decodeUrlSafeBase64(base64: string): string {
  return base64.replace(/[.]/g, '+').replace(/[_]/g, '/').replace(/[-]/g, '=');
}
