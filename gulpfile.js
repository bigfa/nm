var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglifyjs');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('less', function () {
    gulp.src('static/css/single.less')
        .pipe(less().on('error', function (e){
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer]))
        .pipe(nano())
        .pipe(rename('single.min.css'))
        .pipe(gulp.dest('build/css'))

    gulp.src('static/css/page.less')
        .pipe(less().on('error', function (e){
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer]))
        .pipe(nano())
        .pipe(rename('page.min.css'))
        .pipe(gulp.dest('build/css')) 

    gulp.src('static/css/setting.less')
        .pipe(less().on('error', function (e){
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer]))
        .pipe(nano())
        .pipe(rename('setting.min.css'))
        .pipe(gulp.dest('build/css'))       
});

gulp.task("uglify", function () {

    gulp.src("static/js/setting.js")
        .pipe(uglify())
        .pipe(rename('setting.min.js'))
        .pipe(gulp.dest("build/js"))

    gulp.src("static/js/single.js")
        .pipe(uglify())
        .pipe(rename('single.min.js'))
        .pipe(gulp.dest("build/js"))

    gulp.src("static/js/page.js")
        .pipe(uglify())
        .pipe(rename('page.min.js'))
        .pipe(gulp.dest("build/js"))

    gulp.src("static/js/base.js")
        .pipe(uglify())
        .pipe(rename('base.min.js'))
        .pipe(gulp.dest("build/js"))  

    gulp.src("static/js/vue.min.js")
        .pipe(gulp.dest("build/js"))          
});


gulp.task('default', ['less','uglify']);