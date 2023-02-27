import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  Void: any;
};

export type AppContext = {
  __typename?: 'AppContext';
  isAuthenticated: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type AuthMutation = {
  __typename?: 'AuthMutation';
  changePassword?: Maybe<Scalars['Void']>;
  forgot?: Maybe<Scalars['Void']>;
  login: UserCredentials;
  register: UserCredentials;
};


export type AuthMutationChangePasswordArgs = {
  request: ChangePassword;
};


export type AuthMutationForgotArgs = {
  request: ForgotRequest;
};


export type AuthMutationLoginArgs = {
  request: LoginRequest;
};


export type AuthMutationRegisterArgs = {
  request: RegisterRequest;
};

export type AuthQuery = {
  __typename?: 'AuthQuery';
  user?: Maybe<User>;
};

export type ChangePassword = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export enum Errors {
  EmailTaken = 'EMAIL_TAKEN',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  Unauthorized = 'UNAUTHORIZED'
}

export type ForgotRequest = {
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};

export type LoginHistory = {
  __typename?: 'LoginHistory';
  issuedAt: Scalars['Date'];
  platorm: Platform;
};

export type LoginRequest = {
  email: Scalars['String'];
  password: Scalars['String'];
  remember?: InputMaybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  auth?: Maybe<AuthMutation>;
};

export enum Platform {
  Android = 'ANDROID',
  Desktop = 'DESKTOP',
  Ios = 'IOS',
  Pwa = 'PWA'
}

export type Query = {
  __typename?: 'Query';
  auth?: Maybe<AuthQuery>;
};

export type RegisterRequest = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  loginHistory?: Maybe<Array<Maybe<LoginHistory>>>;
  name?: Maybe<Scalars['String']>;
  partyType?: Maybe<Scalars['Int']>;
  password?: Maybe<Scalars['String']>;
};

export type UserCredentials = {
  __typename?: 'UserCredentials';
  bearer: Scalars['String'];
  expireAt: Scalars['Date'];
  issuedAt: Scalars['Date'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AppContext: ResolverTypeWrapper<AppContext>;
  AuthMutation: ResolverTypeWrapper<AuthMutation>;
  AuthQuery: ResolverTypeWrapper<AuthQuery>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ChangePassword: ChangePassword;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Errors: Errors;
  ForgotRequest: ForgotRequest;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoginHistory: ResolverTypeWrapper<LoginHistory>;
  LoginRequest: LoginRequest;
  Mutation: ResolverTypeWrapper<{}>;
  Platform: Platform;
  Query: ResolverTypeWrapper<{}>;
  RegisterRequest: RegisterRequest;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  UserCredentials: ResolverTypeWrapper<UserCredentials>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppContext: AppContext;
  AuthMutation: AuthMutation;
  AuthQuery: AuthQuery;
  Boolean: Scalars['Boolean'];
  ChangePassword: ChangePassword;
  Date: Scalars['Date'];
  ForgotRequest: ForgotRequest;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  LoginHistory: LoginHistory;
  LoginRequest: LoginRequest;
  Mutation: {};
  Query: {};
  RegisterRequest: RegisterRequest;
  String: Scalars['String'];
  User: User;
  UserCredentials: UserCredentials;
  Void: Scalars['Void'];
};

export type AppContextResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppContext'] = ResolversParentTypes['AppContext']> = {
  isAuthenticated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthMutation'] = ResolversParentTypes['AuthMutation']> = {
  changePassword?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<AuthMutationChangePasswordArgs, 'request'>>;
  forgot?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<AuthMutationForgotArgs, 'request'>>;
  login?: Resolver<ResolversTypes['UserCredentials'], ParentType, ContextType, RequireFields<AuthMutationLoginArgs, 'request'>>;
  register?: Resolver<ResolversTypes['UserCredentials'], ParentType, ContextType, RequireFields<AuthMutationRegisterArgs, 'request'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthQuery'] = ResolversParentTypes['AuthQuery']> = {
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type LoginHistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginHistory'] = ResolversParentTypes['LoginHistory']> = {
  issuedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  platorm?: Resolver<ResolversTypes['Platform'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  auth?: Resolver<Maybe<ResolversTypes['AuthMutation']>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  auth?: Resolver<Maybe<ResolversTypes['AuthQuery']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  loginHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['LoginHistory']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  partyType?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserCredentialsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserCredentials'] = ResolversParentTypes['UserCredentials']> = {
  bearer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expireAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  issuedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type Resolvers<ContextType = any> = {
  AppContext?: AppContextResolvers<ContextType>;
  AuthMutation?: AuthMutationResolvers<ContextType>;
  AuthQuery?: AuthQueryResolvers<ContextType>;
  Date?: GraphQLScalarType;
  LoginHistory?: LoginHistoryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserCredentials?: UserCredentialsResolvers<ContextType>;
  Void?: GraphQLScalarType;
};

