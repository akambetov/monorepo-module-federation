# env vars

  ## передать в скрипте

  package.json
      "build:dev": "webpack --env mode=development",
      "build:prod": "webpack --env mode=production",

  webpack.config.js - обернуть конфиги в функцию, который принимает env vars
      module.exports = (env) => {
      return {
        mode: env.mode ?? 'development',
      };
    };

  
  ## передать через файлы .env.dev && .env.prod && etc.
  npm i dotenv-cli dotenv-webpack @types/dotenv-webpack
  dotenv-webpack - обертка над dotenv && webpack.DefinePligin
  #1. dotenv-cli - в скриптах package.json передает нужный .env файл 
  ### package.json
    "scripts": {
      "start": "dotenv -e .env.dev webpack serve",  // #1
      "build:dev": "dotenv -e .env.dev webpack",    // #1
      "build:prod": "dotenv -e .env.prod webpack"   // #1
    },
  
  ### webpack.config.js
    dotenv-cli - так как загрузили .env.SOME_MODE в скриптах из package.json, в  webpack.config.js можно обращаться к переменным .env.SOME_MODE с помощью process.env.SOME_VAR
    
    dotenv-webpack - обертка над dotenv && webpack.DefinePlugin. Позволяет в "нашем коде" обращаться к переменным из .env.SOME_MODE
    import Dotenv from 'dotenv-webpack';
    #1. В зависимости от mode указываем пути до .env.dev || .env.prod 
      !!! Если не указать path, Dotenv по дефолту ищет .env 
      !!! rootPath указывает на корневой каталог. 

    {
      ...
      plugins: [
        new Dotenv({
          path: process.env.MODE as Configuration['mode'] === 'development' ? `${rootPath}\\.env.dev` : `${rootPath}\\.env.prod`,   // #1
        }),
      ]
    }
    

# Плагины + работа с html

html-webpack-plugin

# Loaders. Typescript

# webpack.config.JS => webpack.config.TS
npm i -D ts-node @types/node @types/webpack

ts-node
@types/node -  потому что webpack работает в среде Node
@types/webpack

  ## tsconfig.json
  #1 "esModuleInterop": true  
    позволяет работать с пакетами, которые используют CommonJS (module.exports, require()) как с обычными пакетами import 
  #2 "allowSyntheticDefaultImports": true
    если у пакета нет default import, loader-ы вроде ts-loader || babel-loader автоматически создают их
    !!!то есть ВМЕСТО 
      import * as webpack from 'webpack'
    !!!можно ПИСАТЬ 
      import webpack from 'webpack' 

    Если сказать по другому, позволяет ипортировать по дефолту, если даже в пакете нет дефолтного экспорта 
  #3 module отличный от commonjs (чтобы могли использовать es6 import), поэтому нужно настроить ts-node 
    ts-node работает в модуле commonjs
  {
    "compilerOptions": {
      ...
      "esModuleInterop": true                   // #1
      "allowSyntheticDefaultImports": true,     // #2
      "module": "ESNext",                       // #3
    },
    "ts-node": {                                // #3
      "compilerOptions": {
        "module": "CommonJS"
      }
    }
  }

  ## webpack.config.ts
  тип конфиг объекта webpack
  config: webpack.Configuration = {
      entry: path.resolve(__dirname, 'src', 'index.ts'),
  }

# React
  ## tsconfig.json
  #1 "jsx": "react-jsx" позволяет не импортировать import React from 'react' (начиная c  React 17 )

  {
    "compilerOptions": {
      "jsx": "react-jsx", // 1
    }
  }

# Style
  ## MiniCssExtractPlugin
    при билде выносит css в отдельные файлы

  ## Изоляция стилей. CSS modules
    Декларация CSS modules (scss) src/global.d.ts
    declare module '*.module.scss' {
      interface IClassNames {
        [className: string]: string;
      }
      const classNames: IClassNames;
      export = classNames;
    }

    !!!в вебпак ничего не надо настраивать, Css Modules буду работать
    Но можно кастомить настройки, например название классов в dev и prod. По умолчанию название классов хэши, например 
    css-loader в webpack

    #1. css-loader будет обрабатывать файлы с названием в конце "module.scss" как Css Modules.
      Если не указать, то все файлы будут обрабатываться как Module Css и перестанут работать обычные стили 
      Обычные стили:  import './App.scss';
      Css Modules:  import classes from './App.module.scss';
    
    #2. разные названия классов для  dev (читабельные) и prod (хэши)
    
    use: [
     ...
     {
      loader: 'css-loader',
        options: {
          modules: {
            auto: (resourcePath: string) => resourcePath.endsWith('module.scss'),   // #1
            localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]',    // #2
          },
        },
      }
    ],

# Routing. react-router-dom
  ## webpack.config.ts
  #1. В SPA весь роутинг происходит через JS за счет History API
      !!! Работает только для дев сервера
      !!! если раздавать статику через nginx, то надо делать  проксирование на index.html
      !!! https://www.youtube.com/watch?v=8OHe6chCWTE
  
  {
    ...
    devServer: {
      ...
      historyApiFallback: true,     // #1
    }
  }

# Алиасы
  ## webpack.config.ts
  {
    ...
    resolve: {
      ...
      alias: {
        '@':  path.resolve(__dirname, 'src')
      }
    }
  }

  tsconfig.json 
  {
    "compilerOptions": {
      ...
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
      // без baseUrl
      
      // "paths": {
      //  "@/*": ["./src/*"]
      //  }

    } 
  }

# Assets
  ## webpack.config.ts
    #1. import mainImage from './images/main.png';
      img.src = mainImage; // '/dist/151cfcfa1bd74779aadb.png'
    #2. Кастомное имя оутпут файла. 
      По дефолту asset/resource генерит [hash][ext][query] (dist/[hash].extension).
      assetModuleFilename складывает все ассеты в папку dist/images/[hash].extension (png, svg, etc.)
      
      {
        ...
        output: {
          filename: 'main.js',
          path: path.resolve(__dirname, 'dist'),
          assetModuleFilename: 'images/[hash][ext][query]' // #2
        },
        module: {
          rules: [
            ...
            {
              test: /\.(png|svg|jpeg|jpg|gif)$/i,
              type: 'asset/resource', // #1
            };
          ]
        }
      }

  ## global.d.ts
    declare module '*.png';
    declare module '*.svg';
    declare module '*.jpeg';
    declare module '*.jpg';
  
  ## Работать с svg как с React компонентом
    npm install @svgr/webpack --save-dev

    #1. icon: true позволяет работать с svg как с иконками, позволяя удобно управлять размерами (height, weight) 
    #2. plugin convertColors позволяет работать с цветом svg через css свойство color или проп color: 
          style={{ color: 'green' }}
          или
          color="red"
          style.color имеет приоритет над color
      По дефолту цвета в svg задаются через свойства fill && stroke (заполнение && обводка). Эти свойства по-прежнему работают и имеет приоритет над style.color и color  

  ### webpack.config.ts
    {
        ...
        module: {
          rules: [
            ...
            {
              test: /\.svg$/,
              issuer: /\.[jt]sx?$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    icon: true,                   // #1
                    svgoConfig: {
                      plugins: [
                        {
                          name: 'convertColors',  // #2
                          params: { currentColor: true },
                        },
                      ],
                    },
                  },
                },
              ],
            }
          ]
        }
      }

  ###  Чтобы ts подсказывал атрибуты/пропсы для SVG компонента, нужно сделать декларацию для .svg файлов
    global.d.ts 
    declare module '*.svg' {
      const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
      export default content;
    }

# Оптимизация (code splitting)
  ## webpack.config.ts
  #1. Весь код  из react|react-dom|react-router-dom собирается в dist/vendor-react.[hash].js (3 либы в 1 чанк). 
    Таким образом код из dist/vendor-react.[hash] закэшируется браузером (до тех пор пока версия какого-то из вышеуказанных библиотек не обновится).
    В основной бандл (main.js) код из react|react-dom|react-router-dom не попадет, что позволяет облегчить основной бандл.
    При изменении "нашего кода", браузер будет загружать только "наш" обновленный код.

  {
    ...
    optimization: {
      splitChunks: {
        cacheGroups: {
          reactVendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,  // #1
            name: 'vendor-react',
            chunks: 'all',
          },
        },
      },
    },
  }

# Проверка типов отдельным (параллельным) процессом
  При сборке ts-loader проверяет ошибки на типы (TS ошибки), что нагружает создание билда.
  Чтобы ts-loader не проверял ошибки во время сборки, нужно настроить webpack
  ## webpack.config.ts
  #1. Происходит только транспиляция кода, без проверки типов TS. Можно настроить в зависимости от dev || prod
  {
    ...
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true, // #1
              },
            },
          ],
        },
      ],
    },
  }


  Таким образом мы скипнули проверку типов, но мы все равно хотим проверять ошибки типов во время сборки.
  Для этого мы можем вынести проверку типов в отдельный процесс.
  npm install --save-dev fork-ts-checker-webpack-plugin
  #1. При добавлении ForkTsCheckerWebpackPlugin options.transpileOnly автоматом ставится в true, поэтому его можно скипнуть в настройках ts-loader
    Либо настроить options.transpileOnly  в зависимости от dev || prod
    Также плагин ForkTsCheckerWebpackPlugin можно добавлять в зависимости от dev || prod
  ## webpack.config.ts
  {
    ...
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',              // #1 
        },
      ],
      plugins: [
        new ForkTsCheckerWebpackPlugin(),   // #1 
      ]
    },
  }

# HMR https://webpack.js.org/guides/hot-module-replacement/
  HMR - позволяет при изменении кода не перезагружая страницу обновлять страницу.
  Если бы мы писали на TS/JS HMR загружал бы только измененный кусок кода, а не весь бандл без перезагрузки страницы. В настройках dev сервера указали бы просто hot: true. 
  Но так не работает с библиотеками как React. Поэтому нужны дополнительные настройки
  
  ## https://github.com/gaearon/react-hot-loader 
  !!! Ожидается, что React-Hot-Loader будет заменен React Fast Refresh. Пожалуйста, удалите React-Hot-Loader, если в вашей среде в настоящее время поддерживается React Fast Refresh.
  
  React Fast Refresh webpack plugin
  https://github.com/pmmmwh/react-refresh-webpack-plugin/
  npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
  
  использование с ts-loader
  npm install -D react-refresh-typescript

  ### webpack.config.ts
    import ReactRefreshTypeScript from 'react-refresh-typescript';
    import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

    {
      ...
       module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  getCustomTransformers: () => ({
                    before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
                  }),
                  transpileOnly: isDevelopment,
                },
              },
            ],
          },
        ],
      }, 
      plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
    }

# Favicon && CopyWebpackPlugin
  ## Favicon
  ### webpack.config.ts
    #1. rootPath - корневая папка

    {
      plugins: [
        new HtmlWebpackPlugin({
          ...
          favicon: path.resolve(rootPath, 'public/favicon.svg'),  // #1
        })
      ]  
    }
    

  ## CopyWebpackPlugin
    npm install copy-webpack-plugin --save-dev
  ### webpack.config.ts
    #1. Копирует файлы с 'public/locales' в 'dist/locales' (условно, зависит куда ведут publicPath и outputPath)
    
    {
      plugins: [
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(publicPath, 'locales'),  // #1
              to: path.resolve(outputPath, 'locales'),    // #1
            },
          ],
        }),
      ]
    }

# Babel
  npm install --save-dev babel-loader @babel/core
  npm install --save-dev @babel/preset-react
  npm install --save-dev @babel/preset-typescript

  ## webpack.config.ts
    #1. runtime: 'automatic' чтобы пофиксить ошибку Uncaught ReferenceError: React is not defined
    {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],  // #1
              ],
            },
          },
        }
      ]
    }

# Babel custom plugin
  Проблема: для тестов в режиме dev/test мы хотим добавить в разметку data-аттрибут date-test.
  В продакшне эти атрибуты не нужны, поэтому при prod сборке мы должны удалить эти data-аттрибуты 

   npm i @types/babel__core --save-dev

   ## build/babel/rm-data-test-id-babel-plugin    
    import { PluginItem } from '@babel/core';
    export const rmDataTestIdBabelPlugin = (): PluginItem => {
      return {
        visitor: {
          Program(path, state) {
            const forbiddenProps = state.opts.props || [];

            path.traverse({
              JSXIdentifier(current) {
                const nodeName = current.node.name;

                if (forbiddenProps.includes(nodeName)) {
                  current.parentPath.remove();
                }
              },
            });
          },
        },
      };
    };

   ## build/babel/build-babel-loader
    #1. Выше написанный плагин build/babel/rm-data-test-id-babel-plugin

    import { IBuildOptions } from '../types/types';
    import { rmDataTestIdBabelPlugin } from './rm-data-test-id-babel-plugin';   // #1

    export const buildBabelLoader = (isProd: IBuildOptions['isProd']) => {
      const plugins = isProd
        ? [[rmDataTestIdBabelPlugin, { props: 'data-test-id' }]]
        : undefined;

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
            plugins,
          },
        },
      };
    };

# SourceMap
  ## webpack.config.ts
  #1. Для продакшн рекомендован 'source-map'.
  Для dev рекомендован 'eval-source-map'.
  https://webpack.js.org/configuration/devtool/
  
  {
    ...
    devtool: isDev ? 'eval-source-map' : 'source-map'   // #1
  }

# Monorepo
  ## root/package.json
    {
      ...
      "workspaces": [
        "packages/*",
        "services/*"
      ]
    }
  

  В корне каждый раз запускать npm i, при добавлений нового локального пакета. Таким образом установятся все пакеты для всех workspace-ов

  ## root/packages/build-config
    создать свой package.json для пакета build-config (webpack):
    npm init -y
    {
      "name": "@packages/build-config",
      "version": "1.0.0",
      "main": "./src/index.ts",
      "devDependencies": { ... } 
    }

    создать tsconfig.json, "composite": true (https://www.youtube.com/watch?v=acAH2_YT6bs 2:49:16)

  ## root/packages/shared
    npm init -y
    {
      "name": "@packages/shared",
      "version": "1.0.0",
      "main": "./src/index.ts"
    }

  ## root/services/host
    #1. в services/host (аппке) надо указать с какими workspace-ами будет работать код
    npm init -y
    package.json
    {
      "name": "host",
      "version": "1.0.0",
      "dependencies": {
        "@packages/shared": "*",          // #1
        "@packages/build-config": "*",    // #1
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.22.1"
      }
    }

# Micro-fronts. Module Federation
  !!! запустить shop && admin, потом host
    из корня
    npm start -w shop
    npm start -w admin
    npm start -w host

    запустить команду start всех workspace-ах
    npm start -workspaces 

  !!! Неправильно загружает скрипт для вложенных маршрутов 
    http://localhost:4000/shop/main.22dd3aa822c715d06424.js
    должен с корня localhost
    http://localhost:4000/main.22dd3aa822c715d06424.js
    
    fix
      new HtmlWebpackPlugin({
        ...
        publicPath: '/'
      })


  !!! webpack.config.ts. Нужно убрать optimization.splitChunks.
  
  ## Во всех аппках (host, shop, admin) создаем:

  ### 1. bootstrap.tsx
    import { createRoot } from 'react-dom/client';
    import { App } from './components/App';
    import { RouterProvider, createBrowserRouter } from 'react-router-dom';
    import { StrictMode, Suspense } from 'react';
    import { LazyShop } from '@/pages/shop/ShopLazy';

    const root = document.getElementById('root');

    if (!root) {
      throw new Error('Root not found');
    }

    const router = createBrowserRouter([
      {
        path: '/',
        element: <App />,
        children: [
          { path: '/shop', element: <LazyShop /> },
        ],
      },
      { path: 'app', element: <div>app</div> },
    ]);

    const container = createRoot(root);

    container.render(
      <StrictMode>
        <Suspense fallback={<div>loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </StrictMode>
    );

  ### 2. index.ts
  #1. В доках добавляют данный экспорт, нз для чего. Возможно для typescript isolatedModules
    import('./bootstrap')
    export {}               // #1

  ## services/shop (подключаемый апп) / services/admin (подключаемый апп) / host (контейнер)
  выносим createBrowserRouter из bootstrap.tsx в router/index.tsx

  ### services/shop/router/index.tsx 
  ### services/admin/router/index.tsx
  ### services/host/router/index.tsx
    #1. routes экспортируем по дефолту, чтобы подключить их в хост-контейнер (services/host)
    import { App } from "@/components/App";
    import { LazyShop } from "@/pages/shop/ShopLazy";
    import { createBrowserRouter } from "react-router-dom";

    const routes = [
      {
        path: '/shop',
        element: <App />,
        children: [
          { path: '/shop/main', element: <LazyShop /> },
        ],
      },
      { path: 'app', element: <div>app</div> },
    ]

    export const router = createBrowserRouter(routes);

    export default routes     // #1

  ### services/shop/bootstrap.tsx
  ### services/admin/bootstrap.tsx
  ### services/host/bootstrap.tsx
    ...
      container.render(
      <StrictMode>
        <Suspense fallback={<div>loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </StrictMode>
    );
  
  ## services/host (контейнер)
  В дочерние роуты хоста надо добавить роуты из services/shop && services/admin (shop и admin будут частью навигации host)
  В данном случае из shop и admin отдаются роуты, но можно отдавать что угодно. Нет строгого правила.
  Например:
    компонент который в себе содержит всю логику, роуты, layout итд;
    отдельные страницы
  
  ### services/host/router/index.tsx
  export const router = createBrowserRouter([
      {
        path: '/',
        element: <App />,
        children: [
          ...shopRoutes,
          ...adminRoutes
        ],
      },
    ]);

  ## ModuleFederationPlugin
  
  ### webpack.config.ts. Подключаемая (удаленная) аппка (shop / admin)
    #1. Название файла, который отдаем наружу
    #2. Что отдаем наружу
    #3. Ключ обязательно должен начинаться с './'
    #4. eager: true -> либа с таким флагом подгрузиться сразу, противоположность lazy-loading
    #5. зафиксирована версия либы

    import webpack from 'webpack'
    import packageJson from './package.json'

    export default () => {
      ...
      const config: Configuration = buildWebpack({ ... });

      config.plugins.push(new webpack.container.ModuleFederationPlugin({
        name: 'shop',
        filename: 'remoteEntry.js',                                               // #1
        exposes: {                                                                // #2
          // './App': path.resolve(paths.src, 'components', 'App', Router.tsx)
          './router': './src/router/index.tsx'                                    // #3
        },
        shared: {
          ...packageJson.dependencies,
          react: {
            eager: true,                                                          // #4
            requiredVersion: packageJson.dependencies['react']                    // #5
          },
          'react-router-dom': {
            eager: true,                                                          // #4
            requiredVersion: packageJson.dependencies['react-router-dom']         // #5
          },
          'react-dom': {
            eager: true,                                                          // #4
            requiredVersion: packageJson.dependencies['react-dom']                // #5
          }
        }
      }))

      return config;
    };

  ### webpack.config.ts. Хост апп (host)
    Тоже самое что для подключаемых (удаленных) аппок, вместо exposes настраиваем remotes
    SHOP_REMOTE_URL && ADMIN_REMOTE_URL пути где запущены аппки (http:localhost:5000 итд)

    #1. 
      ключи shop && admin пути для импортов
      services\host\src\router\index.tsx
      import shopRoutes from 'shop/router';
      import adminRoutes from 'admin/router';
      
      shop && admin в строках
      `shop@${process.env.SHOP_REMOTE_URL}/remoteEntry.js`,  
      `admin@${process.env.ADMIN_REMOTE_URL}/remoteEntry.js`
      соответствуют значению поле name в ModuleFederationPlugin в удаленных аппках

    import webpack from 'webpack'
    import packageJson from './package.json'

    export default () => {
      ...
      const config: Configuration = buildWebpack({ ... });

      config.plugins.push(new webpack.container.ModuleFederationPlugin({
        ...
        name: 'shop',
        remotes: {
          shop: `shop@${process.env.SHOP_REMOTE_URL}/remoteEntry.js`,       // #1
          admin: `admin@${process.env.ADMIN_REMOTE_URL}/remoteEntry.js`     // #1
        },
      }))

      return config;
    };
 