import {
  ApolloClient as BaseApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { Injected, Service } from 'feret';
import type { AuthStateManager } from './AuthStateManager';
import { Config } from './Config';

@Service()
export class Apollo extends BaseApolloClient<any> {

  @Injected('auth')
  private readonly authStateManager!: AuthStateManager;

  constructor(config: Config) {
    const httpLink = new HttpLink({ uri: config.APP_GRAPHQL_PATH, fetch });
    const authMiddleware = new ApolloLink((operation, forward) => {
      const bearer = this.authStateManager.getCredentials()?.bearer;
      operation.setContext({
        headers: {
          authorization: bearer ? `Bearer ${bearer}` : '',
        },
      });
      return forward(operation);
    });
    super({
      link: concat(authMiddleware, httpLink),
      cache: new InMemoryCache(),
    });
  }
}
