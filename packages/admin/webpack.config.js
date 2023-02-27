require('dotenv').config();
const {
  fileLoaderName,
  publicPath,
  filesRegex,
  sassRegex,
  svgrOptions,
} = require('./common');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, args) => {
  const isDevelopment = args.mode !== 'production';

  const defaultEnv = Object.keys(process.env).reduce(
    (acc, key) => {
      if (key.startsWith('APP_')) acc[key] = process.env[key];
      return acc;
    },
    {
      NODE_ENV: args.mode,
      PUBLIC_PATH: publicPath,
    },
  );

  const htmlWebpackOptions = {
    filename: path.resolve(__dirname, 'public/index.html'),
    template: path.resolve(__dirname, 'src/index.ejs'),
    templateParameters: defaultEnv,
    alwaysWriteToDisk: true,
    minify: {
      collapseWhitespace: true,
      keepClosingSlash: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      removeComments: false,
    },
  };

  return {
    devtool: isDevelopment ? 'inline-source-map' : undefined,
    mode: args.mode,
    entry: {
      app: [path.resolve(__dirname, 'src/client.tsx')],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      chunkFilename: '[contenthash].chunk.js',
      publicPath: publicPath,
      clean: true,
    },
    infrastructureLogging: { level: 'error' },
    stats: isDevelopment ? 'errors-warnings' : 'errors-only', 
    performance: isDevelopment ? false : {
      hints: 'error',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    externals: {
      canvas: '{}',
    },
    devServer: {
      static: path.join(__dirname, 'public'),
      historyApiFallback: {
        index: 'index.html',
      },
      client: {
        logging: 'none'
      },
      compress: true,
      port: process.env.PORT || 3000,
      hot: true,
      proxy: {
        '/graphql': {
          target: 'http://localhost:3000',
          router: () => 'http://localhost:4000',
          logLevel: 'debug',
        },
      },
    },
    optimization: !isDevelopment
      ? {
          minimize: true,
          minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
              extractComments: false,
              parallel: true,
              terserOptions: {
                format: {
                  comments: false,
                },
              },
            }),
          ],
          splitChunks: {
            chunks: 'all',
          },
        }
      : {},
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(defaultEnv),
      }),
      ...(isDevelopment
        ? [new HtmlWebpackPlugin(htmlWebpackOptions)]
        : [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
              ...htmlWebpackOptions,
              filename: path.resolve(__dirname, 'dist/page.html'),
            }),
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
            }),
          ]),
      new HtmlWebpackHarddiskPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '**/*',
            context: 'public/',
            globOptions: {
              ignore: ['**/*/index.html'],
            },
          },
        ],
        options: {
          concurrency: 100,
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
        {
          test: filesRegex,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: fileLoaderName,
              },
            },
          ],
        },
        {
          test: /\.svg$/i,
          issuer: /\.tsx?$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
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
              },
            },
          ],
        },
        {
          test: sassRegex,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss')(),
                    require('autoprefixer')(),
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'src')],
                },
              },
            },
          ],
        },
      ],
    },
  };
};
