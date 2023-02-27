import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/**/*.gql',
  generates: {
    './src/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars: {
          Date: 'Date',
        },
      },
    },
  },
};

export default config;
