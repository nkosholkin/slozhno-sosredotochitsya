const gulp = require("gulp");
const concat = require("gulp-concat-css");
const plumber = require("gulp-plumber");
const del = require("del");
const browserSync = require("browser-sync").create();
const jsMinify = require('gulp-minify');

function html() {
  return gulp
    .src("src/**/*.html")
    .pipe(plumber())
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
}

exports.html = html;

function css() {
  return gulp
    .src("src/**/*.css")
    .pipe(plumber())
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest("dist/"));
}

exports.css = css;

function images() {
  return gulp
    .src("src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}")
    .pipe(gulp.dest("dist/images"));
}

exports.images = images;

function scripts() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jsMinify({
      ext: {
        min: '.js'
      },
      noSource: true
    }))
    .pipe(gulp.dest('dist/scripts'))
}

exports.scripts = scripts

function clean() {
  return del("dist");
}

exports.clean = clean;

const build = gulp.series(clean, gulp.parallel(html, css, images, scripts));

exports.build = build;

function watchFiles() {
  gulp.watch(["src/**/*.html"], html);
  gulp.watch(["src/blocks/**/*.css"], css);
  gulp.watch(["src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}"], images);
  gulp.watch(["src/scripts/**/*.js"], scripts);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}


const watchapp = gulp.parallel(build, watchFiles, serve);

exports.watchapp = watchapp;

exports.default = watchapp;
