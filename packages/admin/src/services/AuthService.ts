import { gql } from '@apollo/client';
import { Injected, Service } from 'feret';
import type {
  LoginRequest,
  Mutation,
  Query,
  RegisterRequest,
} from 'interfaces';
import { Apollo } from './Apollo';

@Service()
export class AuthService {
  @Injected()
  private readonly apollo!: Apollo;

  async login(request: LoginRequest) {
    const response = await this.apollo.mutate<Mutation>({
      mutation: gql`
        mutation Login($request: LoginRequest!) {
          auth {
            login(request: $request) {
              bearer
              issuedAt
              expireAt
            }
          }
        }
      `,
      variables: {
        request,
      },
    });
    return response.data?.auth?.login!;
  }

  async register(request: RegisterRequest) {
    const response = await this.apollo.mutate<Mutation>({
      mutation: gql`
        mutation Register($request: RegisterRequest!) {
          auth {
            register(request: $request) {
              bearer
              issuedAt
              expireAt
            }
          }
        }
      `,
      variables: {
        request,
      },
    });
    return response.data?.auth?.register!;
  }

  async getUser() {
    const response = await this.apollo.query<Query>({
      query: gql`
        query {
          auth {
            user {
              id
              name
              email
              partyType
              isActive
              isVerified
              loginHistory {
                issuedAt
                platorm
              }
            }
          }
        }
      `,
    });
    return response.data.auth?.user!;
  }
}
