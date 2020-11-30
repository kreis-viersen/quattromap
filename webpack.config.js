const CopyPlugin = require('copy-webpack-plugin');
const LicensePlugin = require('webpack-license-plugin')
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
  fs: "empty"
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }, ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
          from: './src/index.html',
          to: 'index.html'
        },
        {
          from: './src/img',
          to: 'img'
        }
      ],
    }),
    new LicensePlugin({
      licenseOverrides: {
        // https://github.com/codepunkt/webpack-license-plugin/issues/443
        '@mapbox/fusspot@0.4.0': 'BSD-2-Clause',
        // https://github.com/mapbox/mapbox-gl-js/tree/v1.12.0#license
        'mapbox-gl@1.13.0': 'BSD-3-Clause',
      }
    }),
  ]
};
