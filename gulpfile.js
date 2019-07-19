const pump = require('pump');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const typescriptProject = typescript.createProject('./tsconfig.json');

const sourcemaps = require('gulp-sourcemaps');

const src = './src';
const dist = './dist';
const tsFiles = src + '/**/*.ts';

gulp.task('ts-compile', () => {
	return pump(
		gulp.src(tsFiles),
		sourcemaps.init(),
		typescriptProject(),
		sourcemaps.write(),
		gulp.dest(dist)
	)
});

gulp.task('ts-watch', done => {
	gulp.watch(tsFiles, gulp.parallel('ts-compile'));
	done();
});

gulp.task('ts', gulp.series(
	'ts-compile',
	'ts-watch'
));

gulp.task('default', gulp.parallel(
	'ts'
));
