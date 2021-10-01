const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browser_sync = require('browser-sync').create();
const uglify =require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const cssmin = require('gulp-cssmin');

function browserSync() {
    browser_sync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return del('dist');
}

function images() {
    return src('app/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'));
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browser_sync.stream())
}

function sass() {
    return src('app/scss/**/*.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browser_sync.stream())
}

function style() {
    return src([
        'node_modules/normalize.css/normalize.css'
    ])
        .pipe(concat('libs.min.css'))
        .pipe(cssmin())
        .pipe(dest('app/css'))
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

function fonts() {
    return src("app/fonts/**/*.{eot,woff,woff2,ttf,svg}")
        .pipe(dest('dist/fonts'))
        .pipe(browser_sync.stream())
}

function watching() {
    watch(['app/scss/**/*.scss'], sass);
    watch(['app/js/main.js'], scripts);
    watch(['app/images/**/*'], images);
    watch(['app/fonts/!**/!*.{eot,woff,woff2,ttf,svg}'], fonts);
    watch('app/*.html').on('change', browser_sync.reload);

}

exports.style = style;
exports.sass = sass;
exports.watching = watching;
exports.browserSync = browserSync;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, build);
exports.default = parallel(style, sass, scripts, images, fonts, browserSync, watching);