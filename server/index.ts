"use strict";

import express = require("express");
import {Request,Response} from "express";

const chalk = require('chalk');
const path = require('path');
const logger = require('morgan');
const requireDir = require('require-dir');

import app from './app';

const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(path.resolve(__dirname,'public')));

app.get('/', (req, res) => {
	res.send({ data: "Hello World" });
});

app.use((req,res,next)=>{
	let error:any = new Error('Not Found');
	error.status = 404;
	next(error);
});

if(app.get('env')==='production') {
	app.use((error:any, req:Request, res:Response, next:Function) => {
		res.status(error.status || 500);
		res.send({
			message: error.message
		});
	});
}

if(app.get('env')==='development') {
	app.use((error:any, req:Request, res:Response, next:Function) => {
		res.status(error.status || 500);
		res.send({
			message: error.message,
			stack:error.stack
		});
	});
}

app.listen(PORT,()=>{
	console.log(`Listening on ${chalk.green(PORT)} with ${chalk.magenta(app.get('env'))} mode`);
});