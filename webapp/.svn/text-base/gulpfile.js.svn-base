
//引入gulp
var gulp=require('gulp');

//引入组件
var jshint=require('gulp-jshint'),
    sass=require('gulp-sass'),
    concat=require('gulp-concat'),
    uglify=require('gulp-uglify'),
    rename=require('gulp-rename'),
    minifycss=require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    babel = require("gulp-babel"),
    spritesmith = require('gulp.spritesmith');


var resources="./edenui/common/";
var theme="./edenui/skintheme/";
var pageHtml="./aufw/page/";
var billResources="./form/";
var billResourcesJs="./form/resources/common/";
var billForm="./form/resources/skins/default/";

var bsgrid="./edenui/common/js/jq_plugins/bsgrid/";

var layer="./edenui/common/js/jq_plugins/layer/";

//检查脚本
gulp.task('hintjs',function(){
    gulp.src(billResourcesJs+'js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//layersass
gulp.task('layersass',function(){
    return gulp.src(layer+'/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(layer+'/skin'))
});

//bsgridsass
gulp.task('bsgridsass',function(){
    return gulp.src(bsgrid+'/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(bsgrid))
});

//billsass编译
gulp.task('billsass',function(){
    return gulp.src(billResources+'fceform/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(billResources+'fceform/css'))
});

//billFormsass编译
gulp.task('billformsass',function(){
    return gulp.src(billForm+'sass/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
       .pipe(minifycss())
      .pipe(gulp.dest(billForm+'css'))
});


///主题 sass编译
gulp.task('themesass',function(){
    return gulp.src(theme+'sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(theme+'css'))
});

//eden ui下的样式
gulp.task('sass',function(){
    return gulp.src(resources+'sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true,
            remove:true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(resources+'css'))
});

//雪碧图 待定
gulp.task('sprite', function () {
    console.log(1);
    var spriteData = gulp.src(resources+'produceSprite/images/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding: 10
    }));
    return spriteData.pipe(gulp.dest(resources+'produceSprite/output/'));
});

gulp.task('scripts',function(){
    return  gulp.src(resources+'/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest(resources+'/dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(resources+'/dist'));
});
gulp.task('watch',function(){
    livereload.listen();
    gulp.watch(resources+'sass/*.scss',['sass']);
    //主题样式
    gulp.watch(theme+'sass/*.scss',['them' + 'esass']);
    //办理单样式
    gulp.watch(billResources+'fceform/sass/*.scss',['billsass']);
    gulp.watch(billForm+'sass/*.scss',['billformsass']);

    gulp.watch(bsgrid+'sass/*.scss',['bsgridsass']);

    gulp.watch(layer+'sass/*.scss',['layersass']);

     gulp.watch(billResourcesJs+'js/*.js',['hintjs']);

    gulp.watch([
        pageHtml+'*.html',
        resources + 'css/*.css',
        resources+'js/*.js',
        resources+'sass/*.scss',
    ], function (file) {

        livereload.changed(file.path);
    });

});

gulp.task('default',['watch']);
//gulp.task('default',['watch','sprite']);