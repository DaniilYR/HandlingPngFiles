const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const cleanJS = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('cleanJs', function(){
    return del('./public/GScripts/*.js');
});

gulp.task('makeJs', function(){
    return gulp.src('./public/javascripts/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./public/GScripts/'))
});

gulp.task('cleanCss', function(){
    return del('./public/stylesheets/*.css');
});

gulp.task('makeCss', function(){
    return gulp.src('./public/stylesheets/*.less')
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/stylesheets/'))
});

gulp.task("default",gulp.parallel((gulp.series('cleanJs', 'makeJs')),(gulp.series('cleanCss', 'makeCss'))));