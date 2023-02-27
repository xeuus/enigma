import { Resolvers } from './resolvers';

type GraphQLType = {
  __typename?: any;
};

export type TypeResolvers<
  TContext = any,
  T1 extends GraphQLType = {},
  T2 extends GraphQLType = T1,
  T3 extends GraphQLType = T2,
  T4 extends GraphQLType = T3,
  T5 extends GraphQLType = T4,
  T6 extends GraphQLType = T5,
  T7 extends GraphQLType = T6,
> = {
  [TName in NonNullable<
    | T1['__typename']
    | T2['__typename']
    | T3['__typename']
    | T4['__typename']
    | T5['__typename']
    | T6['__typename']
    | T7['__typename']
  > as `${TName}`]: Resolvers<TContext>[TName];
};

export interface BaseResolver<
  TContext = any,
  T1 extends GraphQLType = {},
  T2 extends GraphQLType = T1,
  T3 extends GraphQLType = T2,
  T4 extends GraphQLType = T3,
  T5 extends GraphQLType = T4,
  T6 extends GraphQLType = T5,
  T7 extends GraphQLType = T6,
> {
  getResolvers(): TypeResolvers<TContext, T1, T2, T3, T4, T5, T6, T7>;
}
