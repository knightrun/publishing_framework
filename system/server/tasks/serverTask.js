import { app, port, severSet } from "../server";

export default function( $, options ) {
    const scssOptions = {
        includePaths : [options.paths.dependencyStyle],
        /*
            outputStyle (Type : String , Default : nested)
            CSS의 컴파일 결과 코드스타일 지정
            Values : nested, expanded, compact, compressed
        */
        outputStyle : "expanded",
        /*
            indentType (>= v3.0.0 , Type : String , Default : space)
            컴파일 된 CSS의 "들여쓰기" 의 타입
            Values : space , tab
        */
        indentType : "tab",
        /*
            indentWidth (>= v3.0.0, Type : Integer , Default : 2)
            컴파일 된 CSS의 "들여쓰기" 의 갯수
        */
        indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용
        /*
            precision (Type : Integer , Default : 5)
            컴파일 된 CSS 의 소수점 자리수.
        */
        precision: 2,
        /*
            sourceComments (Type : Boolean , Default : false)
            컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
            sourceMaps 를 사용한다면 굳이 sourceComments를 사용할 필요는 없음
        */
        sourceComments: false
    };

    const onError = (err) => console.log(err);

    function serverNodeMon(done){
        severSet($, options);
        done();
    }

    function serverBrowserSyncLeload(){
        return $.browserSync.reload( { stream : false } );
    }

    function serverBrowserSync(){
        $.gulp.watch(options.paths.htmlFile, $.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
        $.gulp.watch(options.paths.jsonFile, $.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
        $.gulp.watch(options.paths.jsFile, $.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
        $.gulp.watch(options.paths.cssFile, $.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
    }

    function sassCompile(){
        return $.gulp
            .src(options.paths.scssFile, { sourcemaps: true, since: $.gulp.lastRun(sassCompile) })
            .pipe($.plumber({errorHandler: onError}))
            // SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
            .pipe($.sass(scssOptions).on('error', $.sass.logError))
            .pipe($.using())
            .pipe($.autoprefixer({remove: false}))
            // 소스맵을 사용
            .pipe($.gulp.dest(options.paths.css, { sourcemaps: true}));
    }

    function sassCompileSample(){
        return $.gulp
            .src(options.paths.scssSampleFile, {base: './',  since: $.gulp.lastRun(sassCompileSample)})
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.sass(scssOptions).on('error', $.sass.logError))
            .pipe($.using())
            .pipe($.gulp.dest('./'));
    }

    function sassWatch(){
        $.gulp.watch(options.paths.scssFile, sassCompile);
        $.gulp.watch(options.paths.scssSampleFile, sassCompileSample);
    }

    $.gulp.task('local : 1. run server', $.gulp.series(serverNodeMon, serverBrowserSync));
    $.gulp.task('local : 2. run sass_watch', sassWatch);
    $.gulp.task('local : sass - compile', sassCompile);
    $.gulp.task('local : sass - compile_sample', sassCompileSample);
}