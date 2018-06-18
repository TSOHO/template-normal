var gulp = require('gulp')
var rev = require('gulp-rev')
var del = require('del')
var autoprefixer = require('gulp-autoprefixer')
var inlinesource = require('gulp-inline-source')
var positionHack = require("./positionhack")
var revDel = require('rev-del')

gulp.task('css', function() {
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rev())
    .pipe(gulp.dest('dist/src/css'))
    .pipe(rev.manifest())
    .pipe(revDel({
      dest: 'rev/css'
    }))
    .pipe(gulp.dest('rev/css'))
})

gulp.task('images', function() {
  return gulp.src('src/images/**')
    .pipe(rev())
    .pipe(gulp.dest('dist/src/images'))
    .pipe(rev.manifest())
    .pipe(revDel({
      dest: 'rev/images'
    }))
    .pipe(gulp.dest('rev/images'))
})

var revCollector = require('gulp-rev-collector')
var htmlmin = require('gulp-htmlmin')
var public = ""

gulp.task('rev', function() {
  return gulp.src(['rev/**/*.json', './dist/*.html'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        'src/css/': function(hash) {
          return public + "src/css/" + hash
        },
        'src/images/': function(hash) {
          return public + "src/images/" + hash
        }
      }
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('inlinesource', function() {
  return gulp.src('./*.html')
    .pipe(inlinesource())
    .pipe(positionHack())
    .pipe(gulp.dest('./dist'))
})

gulp.task('libs', function() {
  return gulp.src('src/libs/**')
    .pipe(gulp.dest('./dist/src/libs'))
})

gulp.task('del', function() {
  del.sync(['./dist/**'])
})

gulp.task('default', ['libs', 'inlinesource', 'images', 'rev'])
