import { Service } from 'feret';
import { Config } from '../Config';

import { addMinutes, getUnixTime } from 'date-fns';
import { User, UserCredentials } from 'interfaces';
import { jwtVerify, SignJWT } from 'jose';
import UserModel from '../models/UserModel';

@Service()
export class JWTService {
  private secret!: Uint8Array;

  constructor(config: Config) {
    this.secret = new TextEncoder().encode(config.JWT_SECRET);
  }

  async sign(user: User, minutes: number): Promise<UserCredentials> {
    const issuedAt = new Date();
    const expireAt = addMinutes(issuedAt, minutes);
    const bearer = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(getUnixTime(issuedAt))
      .setExpirationTime(getUnixTime(expireAt))
      .setJti(String(user.id))
      .sign(this.secret);
    return {
      bearer,
      issuedAt,
      expireAt,
    };
  }

  async verify(jwt: string): Promise<User | null> {
    try {
      const {
        payload: { jti },
      } = await jwtVerify(jwt, this.secret, {});
      return await UserModel.findOne({ id: jti }, {
        password: 0,
      });
    } catch {
      return null;
    }
  }
}
