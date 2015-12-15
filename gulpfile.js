
var         gulp = require('gulp');
var       jshint = require('gulp-jshint');
var       uglify = require('gulp-uglify');
var    minifyCSS = require('gulp-minify-css');
var        clean = require('gulp-clean');
var       concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var         sass = require('gulp-sass');
var  runSequence = require('run-sequence');
var  browserSync = require('browser-sync').create();
var      request = require('request');
var           fs = require('fs');
var        async = require('async');

var BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var EXTENSIONS = '{html,ico,txt,jpeg,jpg,png,gif}';

////////////////////////////////////////////////////////////////////////////////

gulp.task('clean-dist', function() {
    return gulp.src('./dist/*').pipe(clean({force: true}));
});

gulp.task('scripts-base', function() {
    gulp.src(['./app/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts-parts', function() {
    gulp.src(['./app/js/parts/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/parts'));
});

gulp.task('scripts', ['scripts-base', 'scripts-parts']);

gulp.task('styles', function() {
    gulp.src(['./app/css/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: BROWSERS }))
    .pipe(minifyCSS({ comments:true, spare:true }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('files', function () {
    gulp.src('./app/**/*.' + EXTENSIONS)
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', function() {

    runSequence(
        'clean-dist',
        'scripts',
        'styles',
        'files'
    );

    browserSync.init({
        server: {
            baseDir: "./dist/",
            middleware: function (request, response, next) {
                _api(request, response, next);
            }
        }
    });

    gulp.watch(['./app/**/*.' + EXTENSIONS], ['files', browserSync.reload]);
    gulp.watch(['./app/css/**/*.scss'], ['styles', browserSync.reload]);
    gulp.watch(['./app/js/**/*.js'], ['scripts', browserSync.reload]);

    function _api(request, response, next) {

        var url = request.originalUrl;
        var method = request.method;
        var bdMask = './app/bd/';
        var apiMask = '/api/';
        var apiAdd = '/api/add/';
        var apiDelete = '/api/delete/';

        // get file list
        if(method === 'GET' && url === apiMask) {

            fs.readdir(bdMask, function(err, files) {
                if (err) throw err;
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify(files));
                //response.end(_circularToJSON(request));
                console.log('api file list sent');
            });

        // get file content
        } else if(method === 'GET' && url.indexOf(apiMask) === 0 && url != apiMask) {

            var filePath = bdMask + url.slice(5);
            
            fs.readFile(filePath, 'utf8', function (err, data) {
                //if (err) throw err;
                if(data) {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.end(data);
                    console.log(filePath + ' sent');
                }
                
                next(); 
            });

        // add or update file
        } else if(method === 'POST' &&  url.indexOf(apiAdd) === 0 ) {

            var json = '';
            request.on('data', function (data) {
                json += data;
            });

            request.on('end', function () {
                var fileName = JSON.parse(json)._fileName;
                var filePath = bdMask + ((fileName) ? fileName : +new Date() + '.json');

                fs.writeFile(filePath, json, 'utf8', function(err, data) {
                    if (err) throw err;
                    console.log(filePath + ' successfully added/edited');
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.end(filePath + ' successfully added/edited');
                    next();
                });

            });

        // delete file
        } else if(method === 'POST' &&  url.indexOf(apiDelete) === 0 ) {

            var filePath = bdMask + url.slice(12);

            fs.unlink(filePath, function() {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(filePath + ' successfully deleted');
                console.log(filePath + ' successfully deleted');
                next();
            });

        } else {
            next();
        }

    }

    function _circularToJSON(obj) {
        seen = [];

        return JSON.stringify(obj, function(key, val) {
           if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        });
    }

});