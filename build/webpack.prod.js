const {merge} = require('webpack-merge')
const webpack = require('webpack')
const baseConf = require('./webpack.base')

const prodConf = {
  mode: 'production',
  entry: './src/draw.js',
  output: {
    filename: "paintLine.js",
    libraryExport:"default"
  }
}

module.exports = merge(baseConf, prodConf)