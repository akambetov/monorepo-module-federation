import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { IBuildOptions } from './types/types';

export const buildDevServer = (
  port: IBuildOptions['port']
): DevServerConfiguration => ({
  port: port || 4000,
  // open: true,

  /*
  В SPA весь роутинг происходит через JS за счет History API
  !!! Работает только для дев сервара
  !!! если раздавать статику через nginx, то надо делать  проксирование на index.html
  !!! https://www.youtube.com/watch?v=8OHe6chCWTE
  */
  historyApiFallback: true,
});
