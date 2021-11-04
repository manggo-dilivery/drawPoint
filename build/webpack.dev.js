const {merge} = require('webpack-merge')
const webpack = require('webpack')
const baseConf = require('./webpack.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const devConf = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: "MyLibrary.[name][hash].js",
  },
  devServer: {
    port: 8900,
    allowedHosts: 'auto',
    static: {
      watch: true,
    },
    hot: true,
    client: {
      overlay: true
    }
  },
  plugins: [
    new HtmlWebpackPlugin({template: "./src/index.html"}),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = merge(baseConf, devConf)