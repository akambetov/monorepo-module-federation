import { IBuildOptions } from '../types/types';
import { rmDataTestIdBabelPlugin } from './rm-data-test-id-babel-plugin';

export const buildBabelLoader = (isProd: IBuildOptions['isProd']) => {
  const plugins = [];

  if (isProd) {
    plugins.push([rmDataTestIdBabelPlugin, { props: 'data-test-id' }]);
  }

  return {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
        plugins: plugins.length ? plugins : undefined,
      },
    },
  };
};
