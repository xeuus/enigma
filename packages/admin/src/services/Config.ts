import { Env, Service } from 'feret';

@Service()
export class Config {
  @Env('http://localhost:4000/graphql')
  APP_GRAPHQL_PATH!: string;
  @Env('http://localhost:4000')
  APP_GRAPHQL_PROXY!: string;
}
