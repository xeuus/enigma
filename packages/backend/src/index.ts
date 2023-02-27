import 'reflect-metadata';
// sep
import { createContainer, Module } from 'feret';
import { Config } from './Config';
import { AuthResolver, DateResolver, RootResolver } from './resolvers';
import { ApolloService } from './services/ApolloService';
import { DatabaseService } from './services/DatabaseService';
import { ExpressService } from './services/ExpressService';

@Module({
  discovery: [Config, AuthResolver, DateResolver, RootResolver],
  bootOrder: [DatabaseService, ApolloService, ExpressService],
})
export class ServerModule {}

(async function () {
  const container = createContainer([ServerModule]);
  await container.bootSequence();
})();
