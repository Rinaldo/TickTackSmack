const path = require('path')

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.join(__dirname, './public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['react']
        }
      }
    ]
  }
};
