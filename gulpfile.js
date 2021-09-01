const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

// use dart-sass for @use
// sass.compiler = require("sass");

// sass task
function scssTask() {
    return src("app/sass/**/*.scss", { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest("dist", {source: "."}));
}


// javascript task
function jsTask() {
    return src("app/js/**/*.js")
        .pipe(babel({ "presets": ["@babel/preset-env"] }))
        .pipe(terser()) // minify js
        .pipe(dest("dist", {sourcemaps: "."}));
}


// browsersync
function browserSyncServer(cb) {
    browsersync.init({
        server: {
            baseDir: ".",
        },
        notify: {
            styles: {
                top: "auto",
                bottom: "0",
            }
        }
    });
    cb();
}


function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}


// watch Task
function watchTask() {
    watch("*.html", browserSyncReload);
    watch(
        ["app/sass/**/*.scss", "app/js/**/*.js"],
        series(scssTask, jsTask, browserSyncReload)
    );
}

// default gulp task 
exports.default = series(scssTask, jsTask, browserSyncServer, watchTask);






