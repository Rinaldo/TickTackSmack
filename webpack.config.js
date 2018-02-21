// const { resolve } = require('path')

// module.exports = {
//   entry: './app/index.jsx',
//   output: {
//     path: __dirname,
//     filename: './public/bundle.js'
//   },
//   context: __dirname,
//   devtool: 'source-map',
//   resolve: {
//     extensions: ['.js', '.jsx']
//   },
//   module: {
//     loaders: [
//       {
//         test: /jsx?$/,
//         include: resolve(__dirname, './app'),
//         loader: 'babel-loader',
//         query: {
//           presets: ['react']
//         }
//       }
//     ]
//   }
// };

const path = require('path')

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.join(__dirname, './public'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
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
