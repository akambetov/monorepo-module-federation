import type { Configuration } from 'webpack';

export const buildResolvers = (src: string): Configuration['resolve'] => ({
  extensions: ['.tsx', '.ts', '.js'],
  alias: {
    '@': src,
  },
});
