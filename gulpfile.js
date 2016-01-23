var gulp = require('gulp');
var concat = require('gulp-concat'); 
var babel = require('gulp-babel');
var cat = require('gulp-cat');  
var addsrc = require('gulp-add-src');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css'); 
var base64 = require('gulp-base64');
var gulpSequence = require('gulp-sequence');
var exec  =require('child_process').exec;

gulp.task('vendorjs',function() {
/*    vendorJsList=[ 
      "http://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js",
      "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
    ]; */
    vendorJsList=[ 
      "client/build/scripts/jquery.min.js",
      "client/build/scripts/bootstrap.min.js"
    ]; 
    gulp.src(vendorJsList)
        .pipe(concat('presentationScript.js'))  
        .pipe(gulp.dest('client/build/scripts/')); 
});

gulp.task('js',function() {
    appJsList=[ 
      "client/build/scripts/init.js",
      "client/build/scripts/socket.io.js",
      "client/build/scripts/RTCMultiConnection.js",
      "client/build/scripts/canvas-designer-widget.js",
      "client/build/scripts/start.js",
      "client/build.scripts/timer.js"
    ]; 
    gulp.src(appJsList)
        .pipe(uglify())
        .pipe(concat('mainScript.js'))  
        .pipe(gulp.dest('client/build/scripts/')); 
});

gulp.task('css',function() {
/*    cssList=[
      "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
      "http://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css",
      "client/build/css/normalize.css",
      "client/build/css/styles.css"
    ];
*/
    cssList=[
      "client/build/css/bootstrap.min.css",
      "client/build/css/equal-height-columns.css",
      "client/build/css/font-awesome.min.css",
      "client/build/css/normalize.css",
      "client/build/css/styles.css"
    ];

    gulp.src(cssList)
      //.pipe(minifyCss())
      .pipe(concat('mainStyle.css'))
      .pipe(gulp.dest('client/build/css/'));
});

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout,stderr); });
};

gulp.task('git_pull',function(cb){
  execute('git pull',function(resp) {
      cb();
  });
});

gulp.task('default', gulpSequence(
  'vendorjs',
  'js',
  'css'
)); 
