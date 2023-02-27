import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors, { CorsRequest } from 'cors';
import express from 'express';
import { Bootable, Injected, Service } from 'feret';
import { Config } from '../Config';
import { AuthResolver } from '../resolvers';
import { ApolloService } from './ApolloService';

@Service()
export class ExpressService implements Bootable {
  private readonly app = express();

  @Injected()
  private readonly apollo!: ApolloService;

  @Injected()
  private readonly config!: Config;

  @Injected()
  private readonly authResolver!: AuthResolver;

  async onBoot() {
    this.app.use(
      '/graphql',
      cors<CorsRequest>(),
      json(),
      expressMiddleware(this.apollo.getServer(), {
        context: this.authResolver.getContextResolver,
      }),
    );

    this.app.get('/favicon.ico', (req, res) => {
      res.end();
    });

    this.app.use('/', express.static(this.config.PUBLIC_DIR));

    const conn = this.app.listen(this.config.PORT, () => {
      let addr = conn.address();
      if (typeof addr !== 'string')
        addr = `http://${addr?.address}:${addr?.port}`;
      console.log(`listening on ${addr}`);
    });
  }
}
