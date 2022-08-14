import { Configuration } from 'webpack';
import NodemonPlugin from 'nodemon-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default function({ ISDEV }: { ISDEV: true | undefined }): Configuration {
  return {
    mode: ISDEV ? 'development' : 'production',
    entry: {
      index: './src/index'
    },
    module: {
      rules: [
        {
          test: /.ts$/i,
          use: ['ts-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '...']
    },
    target: 'node',
    watch: !!ISDEV,
    plugins: [
      new NodemonPlugin(),
      new ForkTsCheckerWebpackPlugin()
    ],
    externals: [nodeExternals()],
    output: {
      clean: true
    }
  };
}
