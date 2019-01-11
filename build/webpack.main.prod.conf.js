const base = require('./webpack.main.base.conf.js')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = merge(base, {
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '..', 'package.json'),
                to: path.resolve(__dirname, '..', 'dist'),
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new UglifyJsPlugin()
    ]
})