"use strict";
var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var DEVPORT = 8080;
var CSSExtractor = new ExtractTextPlugin("css", "build/css/[name]-style.css");

//noinspection JSUnresolvedFunction
module.exports = {
    devtool: "source-map",
    entry: {
        main: [
            "webpack/hot/dev-server",
            'webpack-dev-server/client?http://localhost:'+DEVPORT,
            "./src/app/main"
        ]
    },
    output: {
        path: path.resolve(__dirname,"./public"),
        filename: "build/js/[name].bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: [path.resolve(__dirname, 'node_modules')]},
            { test: /\.css$/, loader: CSSExtractor.extract("css-loader?root=./build/css",{publicPath:'../../'})},
            { test: /\.scss$/, loader: CSSExtractor.extract("css?sourceMap!sass?sourceMap",{publicPath:'../../'})},
            { test: /\.less$/, loader: CSSExtractor.extract("css?sourceMap!less?sourceMap",{publicPath:'../../'})},
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff&&name=assets/fonts/[name].[ext]" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=assets/fonts/[name].[ext]" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=assets/fonts/[name].[ext]" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&minetype=application/vnd.ms-fontobject&name=assets/fonts/[name].[ext]" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&mimetype=image/svg+xml&name=assets/fonts/[name].[ext]" },
            { test: /\.png$/, loader: "url-loader?limit=10000&minetype=images/jpeg&name=assets/images/[name].[ext]" },
            { test: /\.jpe?g$/, loader: "url-loader?limit=10000&minetype=images/jpeg&name=assets/images/[name].[ext]" },
            { test: /\.gif$/, loader: "url-loader?limit=10000&minetype=images/gif&name=assets/images/[name].[ext]" },
            { test: /\.ts$/, loader: "ts-loader"},
            { test: /\.tsx$/, loader:"ts-loader"}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    externals: {
        "alt": "Alt",
        "io":"io",
        "immutable":"Immutable",
        "react":"React"
    },
    devServer: {
        contentBase: path.resolve(__dirname,"./public"),
        headers: {"X-Custom-Header": "yes"},
        stats: {colors: true},
        noInfo: false,
        port:DEVPORT,
        hot: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        debug: true
    },
    plugins: [
        CSSExtractor,
        new webpack.HotModuleReplacementPlugin()
    ]
};