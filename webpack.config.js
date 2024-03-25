const path = require('path');

module.exports = {
  entry: './static/js/app.js', // Path to your main JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist') // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
