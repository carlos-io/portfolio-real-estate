const { src, dest, series, parallel, watch } = require('gulp');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');


function serve() {
    browserSync.init({
        server: { baseDir: './public' },
        notify: false,
        open: false
    });

    watch('assets/scss/**/*.scss', transformCSS);
    watch('assets/js/**/*.js', transformJS);
    watch('public/**/*.html').on('change', browserSync.reload);
}


function transformCSS() {
    return src('assets/scss/**/*.scss')
        .pipe(sourcemaps.init({ largeFile: true }))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('public/css/'))
        .pipe(browserSync.stream());
}


function transformJS() {
    return src('assets/js/**/*.js')
        .pipe(sourcemaps.init({ largeFile: true }))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('public/js/'));
}


function transformIMG() {
    return src('assets/img/**/*')
        .pipe(imagemin({ verbose: true }))
        .pipe(dest('public/img/'));
}


exports.watch = exports.serve = serve;
exports.default = series(parallel(transformCSS, transformJS, transformIMG))
