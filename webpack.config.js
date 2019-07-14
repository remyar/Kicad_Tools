const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'electron-renderer',
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: './[name].js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            APP_VERSION: JSON.stringify(require("./package.json").version)
        }),
        new HtmlWebpackPlugin({
            filename : 'index.html',
            template :'./src/index.html',
            inject : true
        }),
    ],
    module: {
        rules: [       
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        },
        {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: [['@babel/preset-env' , {modules : 'cjs' } ] , '@babel/preset-react'],
                plugins : [ "@babel/plugin-proposal-class-properties" , '@babel/plugin-transform-async-to-generator', "@babel/plugin-transform-regenerator" ],
                retainLines: true,
            }
        }]
    }
}