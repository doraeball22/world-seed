'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    reference = require("gulp-reference"),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    fileinclude = require('gulp-file-include'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    // browserSync = require('browser-sync'),

    path = {
        dist: {
            html: 'dist/',
            js: 'dist/js/',
            style: 'dist/css/',
            img: 'dist/img/',
            fonts: 'dist/fonts/'
        },
        src: {
            html: ['src/html/**/*.html', '!src/html/template/*.html'],
            js: ['src/js/main.js', 'src/js/lib/device.js'],
            style: 'src/style/main.scss',
            img: 'src/img/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        watch: {
            html: 'src/html/**/*.html',
            js: 'src/js/**/*.js',
            style: ['src/style/**/*.scss', 'src/style/**/*.css'],
            img: 'src/img/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        clean: './dist'
    };

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest(path.dist.html))
        .pipe(livereload());
});

gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(reference())
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dist.js))
        .pipe(livereload());
});

gulp.task('style:build', function() {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(reference())
        .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
        .pipe(prefixer(['last 25 versions', '> 1%', 'ie 9']))
        .pipe(rename({ basename: "style" }))
        .pipe(gulp.dest(path.dist.style))
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dist.style))
        .pipe(livereload());
});

gulp.task('image:build', function() {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function() {
    livereload.listen();


    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch(path.watch.style, function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true
    })
});

// gulp.task('browser-sync', function() {
//     browserSync({
//         server: {
//             baseDir: "./"
//         }
//     });
// });

gulp.task('default', ['build', 'watch', 'connect']);