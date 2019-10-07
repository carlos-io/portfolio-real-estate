const { src, dest,
        series, parallel,
        watch } = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

function serve() {
    browserSync.init({
        server: {
            baseDir: './public'
        }
    });

    watch('assets/scss/**/*.scss', cssTranspile);
    watch('public/**/*.html').on('change', browserSync.reload);
}

function cssTranspile() {
    return src('assets/scss/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(dest('public/css/'))
        .pipe(browserSync.stream());
}

function jsMinify() {
    return src('assets/js/**/*.js')
        // .pipe(dest('public/js/'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('public/js/'));
}


exports.build = series(
    parallel(cssTranspile, jsMinify)
)

exports.default = exports.serve = serve;