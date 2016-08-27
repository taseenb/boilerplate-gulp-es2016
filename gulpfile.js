var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var del = require('del');
var fs = require('fs');
var livereloadPort = 57007;
var port = 9900;

var options = {
  "env": "dev",
};

gulp.task('clean-dev', del.bind(null, ['dev']));
gulp.task('clean-prod', del.bind(null, ['prod']));

gulp.task('sass', function () {
  gulp.src('./src/styles/main.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 10 versions', 'ie >= 9']}))
    .pipe($.minifyCss())
    .pipe(gulp.dest('./' + options.env + '/css'));
});

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/**')
    .pipe(gulp.dest('./' + options.env + '/fonts'));
});


gulp.task('images', function () {
  return gulp.src('./src/images/**')
    .pipe(gulp.dest('./' + options.env + '/img'));
});

gulp.task('html', function () {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./' + options.env));
});

gulp.task('scripts', [], function () {
  gulp.src('src/scripts/main.js')
    .pipe($.tap(function (file) {

      $.util.log('bundling ' + file.path);

      file.contents = browserify(file.path)
        .transform('babelify', {presets: ['es2016']})
        .bundle();

    }))
    .pipe(gulp.dest('./' + options.env + '/js'));
});

gulp.task('dev', ['clean-dev'], function () {
  console.log('Clean up complete. Build ' + options.env);
  gulp.start(['html', 'images', 'fonts', 'sass', 'scripts']);
});

gulp.task('prod', ['clean-prod'], function () {
  options.env = "prod";
  console.log('Clean up complete. Build ' + options.env);
  gulp.start(['html', 'images', 'fonts', 'sass', 'scripts']);
});

gulp.task('watch', function () {
  gulp.watch(['./src/styles/**/*.scss'], ['sass']);
  gulp.watch(['./src/scripts/**'], ['scripts']);
  gulp.watch(['./src/*.html'], ['html']);
  gulp.watch(['./src/images/*'], ['images']);

  // Reload Connect server
  gulp
    .watch('./' + options.env + '/**')
    .on('change', function (file) {
      gulp.src(file.path)
        .pipe($.connect.reload());
    });
});

gulp.task('connect', function () {
  $.connect.server({
    root: options.env,
    port: port,
    livereload: {
      port: livereloadPort,
    },
  });
});

gulp.task('default', ['dev', 'connect', 'watch']);
