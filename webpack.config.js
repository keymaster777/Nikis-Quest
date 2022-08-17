const path = require("path")

const config = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      /*
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        use: 'file-loader'
      },
      */
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './dist')
    },
    compress: false,
    https: false,
    open: true,
    hot: true,
    port: 3003,
  },
  devtool: 'source-map'
}
module.exports = config
