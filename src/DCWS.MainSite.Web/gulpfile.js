"use strict";

const gulp = require("gulp");
const sassCompiler = require("sass");
const gulpSass = require("gulp-sass")(sassCompiler);
const sourcemaps = require("gulp-sourcemaps");
const cleanCss = require("gulp-clean-css");
const ts = require("gulp-typescript");
const terser = require("gulp-terser");

const paths = {
  styles: {
    entry: "Styles/site.scss",
    watch: "Styles/**/*.scss",
    dest: "wwwroot/css"
  },
  scripts: {
    watch: "Scripts/**/*.ts",
    dest: "wwwroot/js"
  }
};

const tsProject = ts.createProject("tsconfig.json");

function styles() {
  return gulp
    .src(paths.styles.entry)
    .pipe(sourcemaps.init())
    .pipe(gulpSass({ outputStyle: "expanded" }).on("error", gulpSass.logError))
    .pipe(cleanCss())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.scripts.watch, scripts);
}

const build = gulp.parallel(styles, scripts);

exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = build;
