import jwt from 'jsonwebtoken';
import fs from 'fs';

export class JwtVerifier {
  constructor(
    private secret: jwt.Secret,
    private defaultVerifyOptions?: jwt.VerifyOptions
  ) {}

  verify(token: string, options?: jwt.VerifyOptions) {
    try {
      return jwt.verify(token, this.secret, {
        ...this.defaultVerifyOptions,
        ...options,
      });
    } catch (e) {
      return null;
    }
  }

  decode(token: string, options?: jwt.VerifyOptions) {
    try {
      return jwt.decode(token, {...this.defaultVerifyOptions, ...options});
    } catch (e) {
      return null;
    }
  }
}

export class MobileJwtVerifier extends JwtVerifier {
  constructor() {
    super(MobileJwtVerifier.getSecret(), {
      issuer: process.env.MOBILE_JWT_ISSUER_NAME || 'Mobile-Auth',
      audience: 'tracker',
      algorithms: [
        (process.env.MOBILE_JWT_ALGORITHM as jwt.Algorithm) || 'HS256',
      ],
    });
  }

  private static getSecret() {
    if (process.env.MOBILE_JWT_SECRET_FILE) {
      return fs.readFileSync(process.env.MOBILE_JWT_SECRET_FILE);
    } else {
      return process.env.MOBILE_JWT_SECRET || 'BabyShark';
    }
  }
}

export default {
  mobileTokenVerifier: new MobileJwtVerifier(),
};
