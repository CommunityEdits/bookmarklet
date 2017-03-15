var gulp = require("gulp"),
    merge = require('merge2'),
    concat = require('gulp-concat'),
    source = require('vinyl-source-stream'),
    tsc = require("gulp-typescript"),
    buffer = require("vinyl-buffer"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    tsify = require('tsify'),
    transform = require('vinyl-transform'),
    browserify = require('browserify'),
    streamify = require('gulp-streamify');


gulp.task("bundle", function () {

    var libraryName = "app";
    var outputFolder = "dist/";
    // XXX: Having trouble getting this minified >>
    var outputFileName = libraryName + ".min.js";


    return browserify()
        .add('src/main.ts')
        .plugin(tsify, { noImplicitAny: true })
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        // .pipe(process.stdout);
        .pipe(gulp.dest(outputFolder))
        .pipe(gulp.dest('../ce_aurelia/scripts/bookmarklet'));
})