import { Configuration } from 'webpack';

export interface IBuildPaths {
  root: string;
  entry: string;
  public: string;
  output: string;
  src: string;
}

export interface IBuildOptions {
  port: number;
  paths: IBuildPaths;
  mode: Configuration['mode'];
  isDev: boolean;
  isProd: boolean;
}
