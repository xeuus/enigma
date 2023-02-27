import { formatISO } from 'date-fns';
import { Service, Tagged } from 'feret';
import { GraphQLScalarType } from 'graphql';
import { BaseResolver } from 'interfaces';
import { BASE_RESOLVER } from '../constants';

@Service()
export class DateResolver implements BaseResolver {
  @Tagged(BASE_RESOLVER)
  getResolvers() {
    return {
      Date: new GraphQLScalarType<Date, string | undefined>({
        name: 'Date',
        description: 'ISO8601 date',
        serialize(value: any) {
          return formatISO(value);
        },
        parseValue(value) {
          return new Date(value as string);
        },
      }),
    };
  }
}
