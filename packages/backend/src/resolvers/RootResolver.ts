import { Service, Tagged } from 'feret';
import {
  AppContext,
  BaseResolver,
  Mutation,
  Query,
  TypeResolvers,
} from 'interfaces';
import { BASE_RESOLVER } from '../constants';

@Service()
export class RootResolver implements BaseResolver {
  @Tagged(BASE_RESOLVER)
  getResolvers(): TypeResolvers<AppContext, Query, Mutation> {
    return {
      Query: {
        auth: () => Promise.resolve<any>({}),
      },
      Mutation: {
        auth: () => Promise.resolve<any>({}),
      },
    };
  }
}
