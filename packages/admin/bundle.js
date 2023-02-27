const {
  filesPlugin,
  sassPlugin,
  svgrPlugin,
  esbuildDecorators,
} = require('./common');

require('esbuild')
  .build({
    entryPoints: ['src/server.tsx'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/bundle.js',
    external: ['canvas'],
    plugins: [filesPlugin(), sassPlugin(), svgrPlugin(), esbuildDecorators()],
  })
  .catch(() => process.exit(1));
