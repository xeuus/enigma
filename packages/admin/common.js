const path = require('path');
const fs = require('fs');
const os = require('os');
const typescript = require('typescript');
const { transform: transformSvg } = require('@svgr/core');
const { interpolateName } = require('loader-utils');
const fileLoaderName = '[name].[md5:contenthash:hex:8].[ext]';
const publicPath = process.env.PUBLIC_PATH || '/';
const filesRegex = /\.(webp|png|jpeg|gif|bmp|jpg|ttf|eot|woff2|woff)$/i;
const sassRegex = /\.(sass|scss|css)$/i;

const svgrOptions = {
  exportType: 'default',
  svgoConfig: {
    multipass: true,
    plugins: [
      {
        name: 'removeViewBox',
        active: false,
      },
    ],
  },
};

function filesPlugin() {
  return {
    name: 'files',
    setup(build) {
      build.onLoad({ filter: filesRegex }, async (args) => {
        const resourcePath = path.resolve(args.resolveDir, args.path);
        const file = await fs.promises.readFile(resourcePath);
        const url = interpolateName({ resourcePath }, fileLoaderName, {
          context: path.resolve(__dirname),
          content: file,
        });

        return {
          contents: `module.exports = "${path.resolve(publicPath, url)}"`,
          loader: 'tsx',
        };
      });
    },
  };
}

function svgrPlugin() {
  return {
    name: 'svgr',
    setup(build) {
      build.onLoad({ filter: /\.svg$/ }, async (args) => {
        const svg = await fs.promises.readFile(args.path, 'utf8');
        const contents = await transformSvg(svg, svgrOptions, {
          filePath: args.path,
        });
        return {
          contents,
          loader: 'tsx',
        };
      });
    },
  };
}

function sassPlugin() {
  return {
    name: 'sass',
    setup(build) {
      build.onLoad({ filter: sassRegex }, async (args) => ({
        contents: '',
      }));
    },
  };
}

const parseTsConfig = (tsconfig, cwd = process.cwd()) => {
  const fileName = typescript.findConfigFile(
    cwd,
    typescript.sys.fileExists,
    tsconfig,
  );
  if (!fileName) {
    throw new Error(`Fail to load tsconfig file (${tsconfig})!`);
  }
  const text = typescript.sys.readFile(fileName);
  if (!text) {
    throw new Error(`Tsconfig file content must not be empty!`);
  }
  const result = typescript.parseConfigFileTextToJson(fileName, text);
  if (result.error) {
    throw new Error(
      `Fail to parser tsconfig file: ` + result.error.messageText,
    );
  }
  const parsedConfig = typescript.parseJsonConfigFileContent(
    result.config,
    typescript.sys,
    path.dirname(fileName),
  );
  if (parsedConfig.errors[0]) {
    throw new Error(
      `Fail to parser tsconfig file: ` + parsedConfig.errors[0].messageText,
    );
  }
  return parsedConfig;
};

const FIND_COMMON_REGX =
  /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g;
const FIND_DECORATOR_REGX =
  /[^'"]@[a-zA-Z$_][\w$]+|[^'"]@\([a-zA-Z$_][\w$]+\)\(/g;
const findDecorators = (content) => {
  content = content?.trim?.();
  if (!content) {
    return false;
  }
  content = content.replace(FIND_COMMON_REGX, '').trim();
  const lines = content
    .split(os.EOL)
    .filter((line) => !line.startsWith('import ') && line.indexOf('@') > -1);
  return !!lines.find((line) => FIND_DECORATOR_REGX.test(line));
};

const esbuildDecorators = (options = {}) => {
  return {
    name: 'tsc',
    setup(build) {
      const tsx = options.tsx === true;
      const cwd = options.cwd || process.cwd();
      const force = options.force === true;
      const tsconfig =
        options.tsconfig ||
        build.initialOptions?.tsconfig ||
        path.join(cwd, 'tsconfig.json');

      const tsConfig = parseTsConfig(tsconfig, cwd);
      if (tsConfig?.options?.sourcemap) {
        tsConfig.options.sourcemap = false;
        tsConfig.options.inlineSources = true;
        tsConfig.options.inlineSourceMap = true;
      }
      build.onLoad(
        {
          filter: tsx ? /\.tsx?$/ : /\.ts$/,
        },
        async (args) => {
          if (!force && !tsConfig?.options?.emitDecoratorMetadata) {
            return;
          }
          const tsContent = await fs.promises
            .readFile(args.path, 'utf8')
            .catch((err) => {
              console.error(`Fail access file (${args.path}): `, err);
              return null;
            });
          if (!tsContent) {
            return;
          }
          const hasDecorator = findDecorators(tsContent);
          if (!hasDecorator) {
            return;
          }
          const program = typescript.transpileModule(tsContent, {
            compilerOptions: tsConfig.options,
          });
          return {
            contents: program.outputText,
          };
        },
      );
    },
  };
};

module.exports = {
  fileLoaderName,
  filesRegex,
  publicPath,
  sassRegex,
  filesPlugin,
  sassPlugin,
  svgrPlugin,
  esbuildDecorators,
  svgrOptions,
};
