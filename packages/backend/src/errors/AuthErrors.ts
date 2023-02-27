import { GraphQLError } from 'graphql';
import { Errors } from 'interfaces';

export class UnauthorizedAccessError extends GraphQLError {
  constructor() {
    super('Unathorized access.', {
      extensions: { code: Errors.Unauthorized },
    });
  }
}

export class InvalidCredentialsError extends GraphQLError {
  constructor() {
    super('Invalid credentials.', {
      extensions: { code: Errors.InvalidCredentials },
    });
  }
}

export class EmailTakenError extends GraphQLError {
  constructor() {
    super('Email address is taken.', {
      extensions: { code: Errors.EmailTaken },
    });
  }
}
