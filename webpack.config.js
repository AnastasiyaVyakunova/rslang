const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseConfig = {
  // entry: {
  //   MainPage: path.resolve(__dirname, './src/ts/MainPage/MainPage.ts'),
  //   SprintPage: path.resolve(__dirname, './src/ts/SprintPage/SprintPage.ts'),
  // },
  entry: path.resolve(__dirname, './src/ts/index.ts'),
  mode: 'development',
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.js$/, loader: 'source-map-loader' },
      { test: /\.template.html$/, loader: 'html-loader' },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash:8][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/html/main.html'),
      filename: 'main.html',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/html/sprint.html'),
      filename: 'sprint.html',
    }),
    new CleanWebpackPlugin(),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
