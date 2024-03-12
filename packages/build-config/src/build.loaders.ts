import type { ModuleOptions } from 'webpack';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { IBuildOptions } from './types/types';
import { buildBabelLoader } from './babel/build-babel-loader';

export const buildLoaders = ({
  isDev,
  isProd,
}: {
  isDev: IBuildOptions['isDev'];
  isProd: IBuildOptions['isProd'];
}): ModuleOptions['rules'] => {
  const cssLoaderWithModules = {
    loader: 'css-loader',
    options: {
      modules: {
        auto: (resourcePath: string) => {
          return resourcePath.endsWith('module.scss');
        },
        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]',
      },
    },
  };

  const cssLoaders = {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      // Translates CSS into CommonJS
      cssLoaderWithModules,
      // Compiles Sass to CSS
      'sass-loader',
    ],
  };

  const assetLoader = {
    test: /\.(png|jpeg|jpg|gif)$/i,
    type: 'asset/resource',
  };

  const svgLoader = {
    test: /\.svg$/,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          icon: true,
          svgoConfig: {
            plugins: [
              {
                name: 'convertColors',
                params: { currentColor: true },
              },
            ],
          },
        },
      },
    ],
  };

  const tsLoaders = {
    test: /\.tsx?$/,
    // use: 'ts-loader',
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: isDev,
          getCustomTransformers: () => ({
            before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
          }),
        },
      },
    ],
    exclude: /node_modules/,
  };

  const babelLoader = buildBabelLoader(isProd);

  return [cssLoaders, /*tsLoaders, */ babelLoader, assetLoader, svgLoader];
};
