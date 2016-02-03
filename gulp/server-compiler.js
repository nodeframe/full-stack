"use strict";

const gulp = require('gulp');
const ts = require('gulp-typescript');
const gutil = require('gulp-util');
const duration = require('gulp-duration');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const using = require('gulp-using');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;
const argv = require('yargs').argv;
const ServerTyperscriptProject = ts.createProject('tsconfig.json');

const typescriptDependencies = [
	'./typings/tsd.d.ts'
];

function typescriptCompilerTask(src,dest,project){
	return gulp.src(src)
				.pipe(plumber())
				.pipe(using({prefix:'Compile'}))
				.pipe(ts(project))
				.pipe(duration(`typescript compile ${gutil.colors.green(src)}`))
				.pipe(gulp.dest(dest));
}

function startServer(){
	if(startServer.node) startServer.node.kill();
    startServer.node = spawn('node',['./build/index.js'],{stdio:'inherit'});
    startServer.node.on('error',(code)=>{
        if(code === 8){
            gutil.log('Error detected waiting for change ...');
        }
    });
}

gulp.task('server:compile','compile server\'s code',()=>
	typescriptCompilerTask([...typescriptDependencies,'./server/**/*.ts'],'./build',ServerTyperscriptProject)
);

gulp.task('server:watch','watch and compile server\'s code',()=>{
	return gulp.watch('./server/**/*.ts',(file)=>{
		typescriptCompilerTask([...typescriptDependencies,file.path],'./build',ServerTyperscriptProject)
		.on('end',()=>{
			if(argv.hot) startServer();
		})
	})
},{
  options: {
    'hot': 'reload server after compiled'
  }
});

gulp.task('server:start','restart server',()=>{
    startServer();
});

gulp.task('server:watch-restart','watch change to restart server',()=>{
    return gulp.watch('./server/**/*.ts',['server:start']);
});
