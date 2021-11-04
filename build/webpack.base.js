const path = require('path')

const webpack = require('webpack')


module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    library: {
      root: "PaintLine",
      amd: "PaintLine",
      commonjs: "PaintLine"
    },
    libraryTarget: "umd"
  },


}