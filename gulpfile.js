const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const minify = require("gulp-minify");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Copy

const copy = () => {
  return gulp.src ([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

const defaultTask = gulp.series(styles);

// Export tasks
exports.styles = styles;
exports.default = defaultTask; // Set the default task

// Html

const html = () => {
  return gulp.src("source/*.html", {base: "source"})
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// JS

const js = () => {
  return gulp.src("source/js/*.js", {base: "source"})
    .pipe(minify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build"));
}

exports.js = js;

// Image Optimization

const images = () => {
  return gulp.src("biuld/img/**/*.{jpg,png,svg}")
    .pipe(imagemin ([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
}

exports.images = images;

// WebP Creation

const createWebp = () => {
  return gulp.src("build/img/**/*.{jpg,png}")
    .pipe(webp({quality: 80}))
    .pipe(gulp.dest("build/img"))
}

exports.webp = createWebp;

// Sprite Creation

const sprite = () => {
  return gulp.src("build/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
      index: "index.min.html"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html));
  gulp.watch("source/*.js", gulp.series(js));
  gulp.watch("source/*.html").on("change", sync.reload);
}

gulp.task("build", gulp.series(clean, copy, styles, html, js, images, createWebp, sprite));
gulp.task("start", gulp.series("build", server, watcher));
