import webpack, { type Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import type { IBuildOptions } from './types/types';
import path from 'path';

interface IBuildPluginsArgs {
  isDev: IBuildOptions['isDev'];
  isProd: IBuildOptions['isProd'];
  rootPath: IBuildOptions['paths']['root'];
  publicPath: IBuildOptions['paths']['public'];
  outputPath: IBuildOptions['paths']['output'];
}

export const buildPlugins = ({
  isDev,
  isProd,
  rootPath,
  publicPath,
  outputPath,
}: IBuildPluginsArgs): Configuration['plugins'] => {
  const plugins: Configuration['plugins'] = [
    new HtmlWebpackPlugin({
      title: isDev ? 'Dev Title' : 'Prod Title',
      template: path.resolve(publicPath, 'index.html'),
      favicon: path.resolve(publicPath, 'favicon.svg'),
      publicPath: '/'
    }),
    new Dotenv({
      path: isDev ? `${rootPath}\\.env.dev` : `${rootPath}\\.env.prod`,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(publicPath, 'locales'),
          to: path.resolve(outputPath, 'locales'),
        },
      ],
    }),
  ];

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin());
    // ForkTsCheckerWebpackPlugin - выносит проверку типов в отдельный процесс, не загружаю сборку
    plugins.push(new ForkTsCheckerWebpackPlugin());
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  if (isProd)
    plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      })
    );

  return plugins;
};
