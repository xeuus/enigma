import { ApolloServer } from '@apollo/server';
import { Bootable, Injected, Service, TagManager } from 'feret';
import { AppContext, readTypeDefs } from 'interfaces';
import { BASE_RESOLVER } from '../constants';

@Service()
export class ApolloService implements Bootable {
  private server!: ApolloServer<AppContext>;

  @Injected()
  private readonly tagManager!: TagManager;

  async onBoot() {
    const resolvers = Object.entries(
      this.tagManager.getSnapshot(BASE_RESOLVER),
    ).reduce((acc, [key, obj]) => {
      Object.assign(acc, obj.getResolvers());
      return acc;
    }, {});

    this.server = new ApolloServer<AppContext>({
      typeDefs: await readTypeDefs(),
      resolvers: resolvers,
      introspection: true,
    });
    await this.server.start();
  }

  getServer() {
    return this.server;
  }
}
