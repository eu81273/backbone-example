var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

gulp.task('bundle-javascript', function () {
    return browserify('src/scripts/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('transfer-html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('transfer-css', function () {
    return gulp.src('src/**/*.css')
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.css', ['transfer-css']);
    gulp.watch('src/**/*.html', ['transfer-html']);
    gulp.watch('src/**/*.js', ['bundle-javascript']);
});

gulp.task('default', ['bundle-javascript', 'transfer-html', 'transfer-css', 'watch']);
