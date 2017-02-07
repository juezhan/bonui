var gulp = require('gulp'),
    useref = require('gulp-useref'),
    cssver = require('gulp-make-css-url-version'),
    minifyCss = require('gulp-clean-css'),
    less = require('gulp-less'),
    header = require('gulp-header')
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    autoprefixer = require('autoprefixer'),
    gulpAutoprefixer = require('gulp-autoprefixer'),
    nano = require('gulp-cssnano'),
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename');

var __dirname = '';
var option = {base: 'src'};
var css_dist = __dirname + 'dist/css';

var BonUI = {
    pkg: require('./package.json'),
    filename:'bonui',
    jsFiles:[
        'src/lib/jquery-3.1.1.min.js',
        'src/lib/swiper.jquery.min.js',
        'src/lib/fastclick.js',
        'src/js/PrototypeExtend.js',
        'src/js/BonUi.js'
    ],
    banner: [
                '/**',
                ' * <%= pkg.name %> <%= pkg.version %>',
                ' * <%= pkg.description %>',
                ' * ',
                ' * Copyright <%= date.year %>, <%= pkg.author %>',
                ' * ',
                ' * Released on: <%= date.month %> <%= date.day %>, <%= date.year %>',
                ' */',
                ''].join('\n'),
    date: {
        year: new Date().getFullYear(),
        month: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' ')[new Date().getMonth()],
        day: new Date().getDate()
    }
}

gulp.task('createCss', function () {
   return gulp.src(['src/less/*.less'])
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});

gulp.task('watch',function(){
    return gulp.watch('src/less/**/*.less', ['fileLess']);
});

// CSS
gulp.task('build:style',function(){
   
    gulp.src('src/less/bonui.less')
        .pipe(sourcemaps.init())
        .pipe(less().on('error', function (e) {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
        .pipe(header(BonUI.banner, { pkg: BonUI.pkg, date: BonUI.date }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(css_dist))
        .pipe(browserSync.reload({stream: true}))
        .pipe(nano({
            zindex: false,
            autoprefixer: false
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(css_dist));

});

// JS
gulp.task('build:scripts', function(){
    
    gulp.src(BonUI.jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat(BonUI.filename + '.js'))
        .pipe(header(BonUI.banner, { pkg : BonUI.pkg, date: BonUI.date } ))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['build:scripts','build:style']);
