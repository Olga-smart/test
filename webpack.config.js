const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    RangeSlider: './Wrapper.ts',
    demo: './demo/demo.ts',
    forPuppeteerHorizontal: './View/pages-for-puppeteer/horizontal/index.ts',
    forPuppeteerVertical: './View/pages-for-puppeteer/vertical/index.ts'
  },
  output: {
    filename: '[name]/[name].js',
    path: path.resolve(__dirname + '/dist'),
    assetModuleFilename: 'assets/[name][ext]'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, '/dist')
    },
    open: './demo/demo.html',
    hot: isDev
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HTMLWebpackPlugin({
      filename: 'demo/demo.html',
      template: './demo/demo.pug',
      scriptLoading: 'blocking',
      chunks: ['RangeSlider', 'demo']
    }),
    new HTMLWebpackPlugin({
      filename: 'forPuppeteerHorizontal/index.html',
      template: './View/pages-for-puppeteer/horizontal/index.pug',
      scriptLoading: 'blocking',
      chunks: ['RangeSlider', 'forPuppeteerHorizontal']
    }),
    new HTMLWebpackPlugin({
      filename: 'forPuppeteerVertical/index.html',
      template: './View/pages-for-puppeteer/vertical/index.pug',
      scriptLoading: 'blocking',
      chunks: ['RangeSlider', 'forPuppeteerVertical']
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]/[name].css'
    }),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js'],
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: isDev
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader', 'resolve-url-loader', 'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|svg|ttf|woff)$/,
        type: 'asset/resource'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ] 
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};