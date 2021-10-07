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
            baseDir: "dist/"
        }
    });
}

function cleanDist() {
    return del('dist');
}

function html() {
    return src('app/*.html', {base: 'app/'})
        .pipe(dest('dist/'))
        .pipe(browser_sync.stream())
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
        .pipe(dest('dist/images/'));
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/mixitup/dist/mixitup.js',
        'node_modules/rateyo/src/jquery.rateyo.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/owl.carousel/dist/owl.carousel.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/'))
}

function js() {
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/'))
        .pipe(browser_sync.stream())
}

function sass() {
    return src('app/scss/*.scss')
        .pipe(scss({
            outputStyle: 'compressed',
            includePaths: './node_modules/'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(concat('style.min.css'))

        .pipe(dest('dist/css/'))
        .pipe(browser_sync.stream())
}

function style() {
    return src([
        'node_modules/css-reset-and-normalize/css/reset-and-normalize.css',
        'node_modules/rateyo/src/jquery.rateyo.css',
        'node_modules/owl.carousel/dist/assets/owl.carousel.css',
        /*'node_modules/owl.carousel/dist/assets/owl.theme.default.css'*/

    ])
        .pipe(concat('libs.min.css'))
        .pipe(cssmin())
        .pipe(dest('dist/css/'))
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/libs.min.js',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

function fonts() {
    return src("app/fonts/**/*.{eot,woff,woff2,ttf,svg}")
        .pipe(dest('dist/fonts/'))
        .pipe(browser_sync.stream())
}

function watching() {
    watch(['app/scss/**/*.scss'], sass);
    watch(['app/js/*.js'], js);
    watch(['app/images/**/*'], images);
    watch(['app/fonts/!**/!*.{eot,woff,woff2,ttf,svg}'], fonts);
    watch('app/*.html', html);

}

exports.html = html;
exports.style = style;
exports.sass = sass;
exports.watching = watching;
exports.browserSync = browserSync;
exports.scripts = scripts;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, build);
exports.default = parallel(html, style, sass, scripts, js, images, fonts, browserSync, watching);