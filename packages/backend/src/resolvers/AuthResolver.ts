import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone';
import { Injected, Service, Tagged } from 'feret';
import {
  AppContext,
  AuthMutation,
  AuthQuery,
  BaseResolver,
  TypeResolvers,
} from 'interfaces';
import { Config } from '../Config';
import { BASE_RESOLVER } from '../constants';
import {
  EmailTakenError,
  InvalidCredentialsError,
  UnauthorizedAccessError,
} from '../errors/AuthErrors';
import User from '../models/UserModel';
import { JWTService } from '../services/JWTService';
import bcrypt from 'bcrypt';

type ServerArgs = StandaloneServerContextFunctionArgument;

@Service()
export class AuthResolver implements BaseResolver {
  @Injected()
  private readonly jwt!: JWTService;
  @Injected()
  private readonly config!: Config;

  getContextResolver = async ({ req }: ServerArgs): Promise<AppContext> => {
    let bearer = String(req.headers.authorization).substring(7);
    if (bearer) {
      const user = await this.jwt.verify(bearer);
      return {
        isAuthenticated: true,
        user: user,
      };
    }
    return {
      isAuthenticated: false,
    };
  };

  @Tagged(BASE_RESOLVER)
  getResolvers = (): TypeResolvers<AppContext, AuthQuery, AuthMutation> => {
    return {
      AuthQuery: {
        user: async (parent, args, context) => {
          if (!context.isAuthenticated) throw new UnauthorizedAccessError();
          return context.user!;
        },
      },
      AuthMutation: {
        login: async (parent, { request: { email, password, remember } }) => {
          let user = await User.findOne({ email });
          if (!user || !(await bcrypt.compare(password, user.password!)))
            throw new InvalidCredentialsError();

          return this.jwt.sign(
            user,
            remember
              ? Number(this.config.TOKEN_DURATION_LONG)
              : Number(this.config.TOKEN_DURATION_SHORT),
          );
        },
        register: async (parent, { request: { email, name, password } }) => {
          let user = await User.findOne({ email });
          console.log(user);
          if (user) throw new EmailTakenError();
          const hashed = await bcrypt.hash(password, 10);
          user = new User({ email, name, password: hashed });
          await user.save();
          return this.jwt.sign(user, Number(this.config.TOKEN_DURATION_SHORT));
        },
      },
    };
  };
}
