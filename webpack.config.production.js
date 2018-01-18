const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    vendor: ['semantic-ui-react'],
    app: './src/index.js'
  },
  output: {
    // We want to create the JavaScript bundles under a 
    // 'static' directory
    filename: 'static/[name].[hash].js',

    // Absolute path to the desired output directory. In our case 
    // a directory named 'dist'
    // '__dirname' is a Node variable that gives us the absolute
    // path to our current directory. Then with 'path.resolve' 
    // we join directories
    path: path.resolve(__dirname, 'dist'),

    publicPath: '/'
  },

  // Change to production source maps
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,

        // We configure 'Extract Text Plugin'
        use: ExtractTextPlugin.extract({

          // loader that should be used when the
          // CSS is not extracted
          fallback: 'style-loader',

          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,

                // Allows to configure how many loaders 
                // before css-loader should 
                // be applied to @import(ed) resources
                importLoaders: 1,

                camelCase: true,

                // Create source maps for CSS files
                sourceMap: true
              }
            },
            {
              // PostCSS will run before css-loader and will 
              // minify and autoprefix our CSS rules.
              // We are also telling it to only use the last 2 
              // versions of the browsers when autoprefixing
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    autoprefixer: {
                      browsers: 'last 2 versions'
                    }
                  }
                }
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    // DefinePlugin Allows you to create global constants 
    // which can be configured at compile time.
    // Then we tell React to ignore all of the non-production 
    // code with the 'production' environment variable
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // Minify and uglify our production bundles, creating 
    // source maps and removing comments
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    }),

    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/bucket-icon-yellow-b.ico'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),
    
    // Create the stylesheet under 'styles' directory
    new ExtractTextPlugin({
      filename: 'styles/styles.[contenthash].css',
      allChunks: true
    })
  ]
};