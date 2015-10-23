var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

gulp.task('static-server', ['bundle-javascript', 'update-html', 'update-css'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('bundle-javascript', function () {
    return browserify('src/scripts/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('update-javascript', ['bundle-javascript'], function () {
    return browserSync.reload();
});

gulp.task('update-html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});

gulp.task('update-css', function () {
    return gulp.src('src/**/*.css')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.css', ['update-css']);
    gulp.watch('src/**/*.html', ['update-html']);
    gulp.watch('src/**/*.js', ['update-javascript']);
});

gulp.task('default', ['static-server', 'watch']);
