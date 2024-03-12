import path from 'path';
import webpack from 'webpack'
import type { Configuration } from 'webpack';
import { buildWebpack } from '@packages/build-config';
import packageJson from './package.json'

export default () => {
  const mode = process.env.MODE as Configuration['mode'];
  const isDev = mode === 'development';
  const isProd = mode === 'production';

  const config: Configuration = buildWebpack({
    mode,
    port: +process.env.PORT,
    paths: {
      root: path.resolve(__dirname),
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      output: path.resolve(__dirname, 'dist'),
      public: path.resolve(__dirname, 'public'),
      src: path.resolve(__dirname, 'src'),
    },
    isDev,
    isProd,
  });

  config.plugins.push(new webpack.container.ModuleFederationPlugin({
    name: 'admin',
    filename: 'remoteEntry.js',
    exposes: {
      // './App': path.resolve(paths.src, 'components', 'App', Router.tsx)
      './router': './src/router/index.tsx'
    },
    shared: {
      ...packageJson.dependencies,
      react: {
        eager: true,
        requiredVersion: packageJson.dependencies['react']
      },
      'react-router-dom': {
        eager: true,
        requiredVersion: packageJson.dependencies['react-router-dom']
      },
      'react-dom': {
        eager: true,
        requiredVersion: packageJson.dependencies['react-dom']
      }
    }
  }))

  return config;
};
