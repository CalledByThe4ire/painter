/* eslint function-paren-newline: 0, arrow-body-style: 0 */

import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import del from 'del';
import runSequence from 'run-sequence';
import concat from 'gulp-concat';
import streamqueue from 'streamqueue';
import ghPages from 'gulp-gh-pages';
import imagemin from 'gulp-imagemin';
import cache from 'gulp-cache';

gulp.task('deploy', () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('clean', () => del.sync('./dist'));

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: 'dist',
    },
  });
});

gulp.task('images', () => {
  return gulp.src('./app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('styles', () => {
  const supported = ['last 2 versions'];
  return gulp
    .src('./app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano({ autoprefixer: { browsers: supported, add: true } }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', () => {
  return streamqueue(
    { objectMode: true },
    gulp.src('node_modules/babel-polyfill/dist/polyfill.js'),
    gulp.src('./app/js/**/utils.js'),
    gulp.src('./app/js/**/Cell.js'),
    gulp.src('./app/js/**/Grid.js'),
    gulp.src('./app/js/**/index.js'),
  )
    .pipe(babel({ presets: ['env'] }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', () => {
  return gulp
    .src('./app/**/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', () => {
  gulp.watch('./app/scss/**/*.scss', ['styles']);
  gulp.watch('./app/js/**/*.js', ['scripts']);
  gulp.watch('./app/**/*.html', ['html']);
  gulp.watch('./app/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
});

gulp.task('default', (callback) => {
  runSequence(['html', 'styles', 'scripts', 'images', 'browserSync'], 'watch', callback);
});

gulp.task('build', (callback) => {
  runSequence('clean', ['html', 'styles', 'scripts', 'images'], callback);
});
