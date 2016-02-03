"use strict";
var express = require("express");
var chalk = require('chalk');
var path = require('path');
var logger = require('morgan');
var requireDir = require('require-dir');
////
var app_1 = require('./app');
var PORT = process.env.PORT || 3000;
app_1.default.use(logger('dev'));
app_1.default.use(express.static(path.resolve(__dirname, 'public')));
app_1.default.get('/', function (req, res) {
    res.send({ data: "Hello World" });
});
// k
app_1.default.use(function (req, res, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});
if (app_1.default.get('env') === 'production') {
    app_1.default.use(function (error, req, res, next) {
        res.status(error.status || 500);
        res.send({
            message: error.message
        });
    });
}
if (app_1.default.get('env') === 'development') {
    app_1.default.use(function (error, req, res, next) {
        res.status(error.status || 500);
        res.send({
            message: error.message,
            stack: error.stack
        });
    });
}
app_1.default.listen(PORT, function () {
    console.log("Listening on " + chalk.green(PORT) + " with " + chalk.magenta(app_1.default.get('env')) + " mode");
});
