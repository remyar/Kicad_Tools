const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    target: 'electron-renderer',
    entry: {
      main: './src/app.js'
    },
    output: {
      filename: '../app.js',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      sourcePrefix: ''  // removes tabs before multiline strings
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
      new webpack.NamedModulesPlugin(),
      new VueLoaderPlugin(),
    /*  new HtmlWebpackPlugin({
        filename : 'index.html',
        template :'index.html',
        inject : true
      }),*/
    ],
    module: {
      rules: [
        {
          test: /\.styl(us)?$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'stylus-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015' , 'env' , 'stage-0'],
            retainLines: true,
          }
        },
        {
          test: /\.vue$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'vue-loader',
          query: {
            presets: ['es2015' , 'env' , 'stage-0'],
            retainLines: true,
          }
        }
      ]
    },
    devServer: {
      hot: true,
      publicPath: '/dist',
    }
}