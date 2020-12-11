import gulp from 'gulp';
import browserSync from 'browser-sync';
import merge from 'merge-stream';
import gulpLoadPlugins from 'gulp-load-plugins';
import { severSet } from "../server/server";
import { paths } from '../settings/paths'

const plugins = gulpLoadPlugins({
    pattern: ['gulp-*', 'gulp.*', '@*/gulp{-,.}*'],
    scope: ['dependencies', 'devDependencies', 'peerDependencies'],
});

export default () => {
    const scssOptions = {
        includePaths : [paths.dependencyStyle],
        /*
            outputStyle (Type : String , Default : nested)
            CSS의 컴파일 결과 코드스타일 지정
            Values :
                nested : 계층 구조시 ul 보다 ul li 앞에 공백이 더 있다는 것이 특징,
                expanded : 계층 구조라 하더라도 선택자 앞에, 즉 ul li 앞에 공백이 없음,
                compact : 선언이 여러 개 있어도 줄바꿈을 하지 않음,
                compressed :불필요한 공백을 모두 제거
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
        severSet();
        done();
    }

    function serverBrowserSyncLeload(){
        return browserSync.reload( { stream : false } );
    }

    function serverBrowserSync(){
        gulp.watch(paths.htmlFile, plugins.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
        gulp.watch(paths.jsonFile, plugins.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
        gulp.watch(paths.jsFile, plugins.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
        gulp.watch(paths.cssFile, plugins.batch((event, done) => {
            serverBrowserSyncLeload();
        }));
    }

    function sassCompile(){
        return gulp
            .src(paths.scssFile, { sourcemaps: true, since: gulp.lastRun(sassCompile) })
            .pipe(plugins.plumber({errorHandler: onError}))
            // SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
            .pipe(plugins.sass(scssOptions).on('error', plugins.sass.logError))
            .pipe(plugins.using())
            .pipe(plugins.autoprefixer({remove: false}))
            // 소스맵을 사용
            .pipe(gulp.dest(paths.css, { sourcemaps: true}));
    }

    function sassCompileSample(){
        return gulp
            .src(paths.scssSampleFile, { base: './',  since: gulp.lastRun(sassCompileSample) })
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.sass(scssOptions).on('error', plugins.sass.logError))
            .pipe(plugins.using())
            .pipe(gulp.dest('./'));
    }

    function sassCompileDependency(){
        const css = gulp
            .src(paths.scssFile, { sourcemaps: true })
            .pipe(plugins.plumber({errorHandler: onError}))
            // SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
            .pipe(plugins.sass(scssOptions).on('error', plugins.sass.logError))
            .pipe(plugins.using())
            .pipe(plugins.autoprefixer({remove: false}))
            // 소스맵을 사용
            .pipe(gulp.dest(paths.css, { sourcemaps: true}));

        const sample = gulp
            .src(paths.scssSampleFile, { base: './' })
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.sass(scssOptions).on('error', plugins.sass.logError))
            .pipe(plugins.using())
            .pipe(gulp.dest('./'));

        return merge( css, sample );
    }

    function sassWatch(){
        gulp.watch(paths.dependencyStyleFile, sassCompileDependency);
        gulp.watch(paths.scssFile, sassCompile);
        gulp.watch(paths.scssSampleFile, sassCompileSample);
    }

    gulp.task('dev_run-server', gulp.series(serverNodeMon, serverBrowserSync));
    gulp.task('dev_run-sass-watch', sassWatch);
    gulp.task('dev_sass-compile', sassCompile);
    gulp.task('dev_sass-compile-sample', sassCompileSample);
}
