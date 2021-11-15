const CopyPlugin = require('copy-webpack-plugin');
const LicensePlugin = require('webpack-license-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    devMiddleware: {
      stats: 'minimal'
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
        '@mapbox/fusspot@0.4.0': 'BSD-2-Clause'
      },
      // mapbox-gl uses a custom license
      excludedPackageTest: name => name === 'mapbox-gl',
      additionalFiles: {
        'oss-licenses.json': packages => JSON.stringify([...packages, {
          'name': 'mapbox-gl',
          'version': '1.13.1',
          'repository': 'https://github.com/mapbox/mapbox-gl-js',
          'license': "Mapbox license",
          'licenseText': 'content of LICENSE.txt in mapbox-gl-js root directory: https://raw.githubusercontent.com/mapbox/mapbox-gl-js/v1.13.1/LICENSE.txt'
        }], null, 2)
      }
    }),
  ]
};