import type { Configuration } from 'webpack';
import { buildDevServer } from './build.dev-server';
import { buildLoaders } from './build.loaders';
import { buildPlugins } from './build.plugins';
import { buildResolvers } from './build.resolvers';
import type { IBuildOptions } from './types/types';

export const buildWebpack = (options: IBuildOptions): Configuration => {
  const { mode, port, isDev, isProd, paths } = options;

  return {
    mode,
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: '[name].[contenthash].js',
      clean: true, // очищает папку dist при каждом билде
      assetModuleFilename: 'images/[hash][ext][query]',
    },
    plugins: buildPlugins({
      isDev,
      isProd,
      rootPath: paths.root,
      publicPath: paths.public,
      outputPath: paths.output,
    }),
    module: {
      rules: buildLoaders({ isDev, isProd }),
    },
    resolve: buildResolvers(paths.src),
    optimization: {
      splitChunks: {
        cacheGroups: {
          reactVendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'vendor-react',
            chunks: 'async',
          },
        },
      },
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    devServer: isDev ? buildDevServer(port) : undefined,
  };
};
