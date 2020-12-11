import moment from 'moment';
import path from 'path';
import fs from 'fs';
import globby from 'globby';
import fancyLog from 'fancy-log';
import gulp from 'gulp';
import merge from 'merge-stream';
import del from 'del';
import gulpLoadPlugins from "gulp-load-plugins";
import pkg from '../../package.json';
import manageEnvironment from "../render/manageEnvironment";
import {loadPreviewLanguagePath, loadPreviewPath} from "../render/nodePath";
import { paths } from '../settings/paths';
import { options } from '../../gulpfile.babel'

const plugins = gulpLoadPlugins({
    pattern: ['gulp-*', 'gulp.*', '@*/gulp{-,.}*'],
    scope: ['dependencies', 'devDependencies', 'peerDependencies'],
});

export default () => {
    //배너 정보를 css에 추가하려면 plugins.header 주석 제거
    const banner = [
        "/**",
        " * @project        <%= pkg.name %>",
        " * @author         <%= pkg.author %>",
        " * @description    <%= pkg.description %>",
        " * @build          " + moment().format("llll") + " ET",
        " * @copyright      Copyright (c) " + moment().format("YYYY") + ", <%= pkg.copyright %>",
        " */",
        ""
    ].join("\n");

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
        outputStyle : 'expanded',
        /*
            indentType (>= v3.0.0 , Type : String , Default : space)
            컴파일 된 CSS의 "들여쓰기" 의 타입
            Values : space , tab
        */
        indentType : 'tab',
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

    function getDataForFile(file){
        let jsonUrl = path.join(file.history[0].replace('.html','.json'));
        let jsonData;

        // if(file.history[0].indexOf('.html') !== -1){
        //     jsonUrl = path.join(file.history[0].replace('.html','.json'));
        // }

        if(fs.existsSync(jsonUrl)){
            // console.log(`file exists`);
            jsonData = JSON.parse(fs.readFileSync(jsonUrl, 'utf8'));

            const footerPath = path.join(paths.html,'/common/footer.json');
            if(fs.existsSync(footerPath)){
                const footerJson = JSON.parse(fs.readFileSync(footerPath, 'utf8'));
                Object.assign(jsonData,footerJson);
            }

            const headerPath = path.join(paths.html,'/common/header.json');
            if(fs.existsSync(headerPath)){
                const headerJson = JSON.parse(fs.readFileSync(headerPath, 'utf8'));
                Object.assign(jsonData,headerJson);
            }
        }else{
            // console.log(`dont't file exists`);
            if(file.history[0].indexOf('@guide') !== -1){
                jsonUrl = path.join(paths.IA);
                jsonData = JSON.parse(fs.readFileSync(jsonUrl, 'utf8'));

                const compGlob = globby.sync(paths.pageHtml,{
                    expandDirectories: {
                        extensions: ['html']
                    }
                });

                const compData = options.multilingual ? loadPreviewLanguagePath(compGlob) : loadPreviewPath(compGlob);
                jsonData.compNode = compData;

                const guideGlob = globby.sync(paths.sampleHtml,{
                    expandDirectories: {
                        extensions: ['html']
                    }
                });

                const guideData = loadPreviewPath(guideGlob);
                jsonData.guideNode = guideData;

                const otherGlob = globby.sync(paths.otherHtml,{
                    expandDirectories: {
                        extensions: ['html']
                    }
                });
                const otherData = loadPreviewPath(otherGlob);
                jsonData.otherNode = otherData;
            }else{
                jsonData = {};
            }
        }
        return jsonData;
    }

    function getGuideDataForFile(file){
        const jsonUrl = paths.IA;
        let jsonData;
        if(fs.existsSync(jsonUrl)){
            // console.log(`file exists`);
            jsonData = JSON.parse(fs.readFileSync(jsonUrl, 'utf8'));

            const compGlob = globby.sync(paths.pageHtml,{
                expandDirectories: {
                    extensions: ['html']
                }
            });

            const compData = options.multilingual ? loadPreviewLanguagePath(compGlob) : loadPreviewPath(compGlob);
            jsonData.compNode = compData;

            const guideGlob = globby.sync(paths.sampleHtml,{
                expandDirectories: {
                    extensions: ['html']
                }
            });

            const guideData = loadPreviewPath(guideGlob);
            jsonData.guideNode = guideData;

            const otherGlob = globby.sync(paths.otherHtml,{
                expandDirectories: {
                    extensions: ['html']
                }
            });
            const otherData = loadPreviewPath(otherGlob);
            jsonData.otherNode = otherData;
        }else{
            // console.log(`dont't file exists`);
            jsonData = '';
        }
        return jsonData;
    }

    function htmlBuild(title, filePath, destPath, regex){
        fancyLog(`-> Building Product Nunjucks To ${title}`);
        // del(paths.distHtml);

        let relativePath = '';
        return gulp
            .src(filePath)
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.data(getDataForFile))
            .pipe(plugins.nunjucksRender({
                envOptions: {
                    autoescape: false
                },
                path: [
                    paths.src
                ],
                manageEnv : manageEnvironment
            }))
            .on('error', (e) => {
                console.log(e);
                this.emit('end');
            })
            .pipe(plugins.prettyHtml())
            //removeComments : html 파일에서 모든 주석 제거, removeSpaces html 파일에서 중복된 공백제거
            .pipe(plugins.removeEmptyLines())
            .pipe(plugins.if(options.relativePath, plugins.tap((file, t) => {
                let directoryLen = regex.toString().includes('page') ? 1 : 2
                const filePath = file.path.replace(/\\/g, '/');
                const subStringPath = filePath.substring(regex.exec(filePath).index);
                const len = subStringPath.match(/\//g) ? subStringPath.match(/\//g).length + directoryLen : directoryLen;
                const returnPath = (() => {
                    let str = '';
                    let i = 0;
                    for(;i<len;i++){
                        str += '../';
                    }
                    return str;
                })();

                relativePath = returnPath;

                // console.log(file.path, t);
            })))
            .pipe(plugins.if(options.relativePath, plugins.replaceTask({
                patterns: [
                    {
                        match : /\/css/gi,
                        replacement : (match, pl) => {
                            return `${relativePath}css`;
                        }
                    },
                    {
                        match : /\/dependency/gi,
                        replacement : (match, pl) => {
                            return `${relativePath}dependency`;
                        }
                    },
                    {
                        match : /\/js/gi,
                        replacement : (match, pl) => {
                            return `${relativePath}js`;
                        }
                    },
                    {
                        match : /\/images/gi,
                        replacement : (match, pl) => {
                            return `${relativePath}images`;
                        }
                    },
                    {
                        match : /\/videos/gi,
                        replacement : (match, pl) => {
                            return `${relativePath}videos`;
                        }
                    },
                    {
                        match : /\/html\/page\/en/gi,
                        replacement : (match, pl) => {
                            return '..';
                        }
                    }
                ]
            })))
            .pipe(plugins.using())
            .pipe(gulp.dest(destPath));
    }

    function productHtml(){
        fancyLog("-> Building Product Nunjucks To Html");
        // del(paths.distHtml);
        const regex = /(?<=src\/html\/page\/)/gi;
        const build = htmlBuild('html', paths.htmlFile, paths.distHtml, regex);
        return build;
    }

    function productStaticCss(){
        return gulp
            .src(paths.cssStaticFile, {since: gulp.lastRun(productStaticCss)})
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distStaticCss));
    }

    function productCss(){
        fancyLog("-> Building Product Sass To Css");

        const regex = /(?<=src\/css\/)/gi;
        let relativePath = '';
        return gulp
            .src(paths.scssFile, {since: gulp.lastRun(productCss)})
            //오류로 인한 파이프 깨짐 방지
            // SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
            .pipe(plugins.sass(scssOptions).on('error', plugins.sass.logError))
            .pipe(plugins.using())
            .pipe(plugins.autoprefixer({remove: false}))
            // .pipe(plugins.header(banner, { pkg }))
            .pipe(plugins.if(options.relativePath, plugins.tap((file, t) => {
                const filePath = file.path.replace(/\\/g, '/');
                const substringPath = filePath.substring(regex.exec(filePath).index);
                const len = substringPath.match(/\//g) ? substringPath.match(/\//g).length + 1 : 1;
                const returnPath = (() => {
                    let str = '';
                    let i = 0;
                    for(;i<len;i++){
                        str += '../';
                    }
                    return str;
                })();

                relativePath = returnPath;

                // console.log(file.path, t);
            })))
            .pipe(plugins.if(options.relativePath, plugins.replaceTask({
                patterns: [
                    {
                        match : /\/images/gi,
                        replacement : (match, pl) => {
                            return `${relativePath}images`;
                        }
                    },
                    {
                        match : /\/dependency/gi,
                        replacement : (match, pl) => {
                            return `${relativePath}dependency`;
                        }
                    }
                ]
            })))
            .pipe(gulp.dest(paths.distCss));
    }

    function productCssMin(){
        fancyLog("-> Building Product Css Minify");

        return gulp
            .src(paths.disCssFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.newer(paths.distCss + 'all.min.css'))
            // .pipe(plugins.print())
            .pipe(plugins.concat('all.min.css'))
            //css minify
            .pipe(plugins.cssnano({
                discardComments: {
                    removeAll: true
                },
                discardDuplicates: true,
                discardEmpty: true,
                minifyFontValues: true,
                minifySelectors: true
            }))
            // .pipe(plugins.header(banner, { pkg }))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distCss));
    }

    function productJs(done){
        fancyLog("-> Building Product Js");

        const js = gulp
            .src(paths.jsFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            // source stream 상의 파일들이 dist 폴더의 결과물보다 더 최신의 timestamp를 가진 경우에만 스크립으로 흘려보낸다. gulp-cached와는 달리 파일 변경 감지를 하지 않은 케이스에서 사용
            .pipe(plugins.newer(paths.distJs))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distJs));

        const dependency =  gulp
            .src(paths.dependencyScriptFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            // source stream 상의 파일들이 dist 폴더의 결과물보다 더 최신의 timestamp를 가진 경우에만 스크립으로 흘려보낸다. gulp-cached와는 달리 파일 변경 감지를 하지 않은 케이스에서 사용
            .pipe(plugins.newer(paths.distDependencyScript))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distDependencyScript));

        return merge( js, dependency );
    }
    function productJsMin(){
        fancyLog("-> Building Product min.js");

        const js =  gulp
            .src([paths.disJsFile, '!' + paths.disJsMinFile])
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.uglify())
            .pipe(plugins.rename((url) => {
                url.dirname += '/min';
                url.basename += '.min';
                url.extname = '.js'
            }))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distJs));

        const dependency = gulp
            .src([paths.distDependencyScriptFile, '!' + paths.distDependencyScriptMinFile])
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.uglify())
            .pipe(plugins.rename((url) => {
                url.dirname += '/min';
                url.basename += '.min';
                url.extname = '.js'
            }))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distDependencyScript));

        return merge( js, dependency );
    }

    function productJsMinDel(done){
        fancyLog("-> Building Product Delete min.js");
        del(path.join(paths.dist,'**','min'));

        done();
    }

    function productJsBabel(){
        fancyLog("-> Transpiling Javascript via Babel...");

        const js = gulp
            .src(paths.jsFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            // source stream 상의 파일들이 dist 폴더의 결과물보다 더 최신의 timestamp를 가진 경우에만 스크립으로 흘려보낸다.
            .pipe(plugins.newer(paths.distJs))
            .pipe(plugins.babel())
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distJs));

        const dependency = gulp
            .src(paths.dependencyScriptFile)
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.newer(paths.distDependencyScript))
            .pipe(plugins.babel())
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distDependencyScript));

        return merge( js, dependency )
    }

    function productImage(){
        return gulp
            .src(paths.imageFile, { since: gulp.lastRun(productImage) })
            .pipe(plugins.newer(paths.distImage))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distImage));
    }

    function productFont(){
        return gulp
            .src(paths.dependencyFont, { since: gulp.lastRun(productFont) })
            .pipe(plugins.newer(paths.distDependencyFont))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distDependencyFont));
    }

    function productVideo(){
        return gulp
            .src(paths.videoFile, { since: gulp.lastRun(productVideo) })
            .pipe(plugins.newer(paths.distVideo))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distVideo));
    }

    function productBuildGuide(){
        const js = gulp
            .src(paths.guideJsFile)
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distGuideJs));
        const css = gulp
            .src(paths.guideCssFile)
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distGuideCss));
        const html = gulp
            .src(paths.guideHtmlFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.data(getGuideDataForFile))
            .pipe(plugins.nunjucksRender({
                envOptions: {
                    autoescape: false
                },
                path: [
                    paths.src
                ],
                manageEnv : manageEnvironment
            }))
            .on('error', (e) => {
                console.log(e);
                this.emit('end');
            })
            .pipe(plugins.prettyHtml())
            //removeComments : html 파일에서 모든 주석 제거, removeSpaces html 파일에서 중복된 공백제거
            .pipe(plugins.removeEmptyLines())
            .pipe(plugins.replaceTask({
                patterns: [
                    {
                        match : /\/@guide/gi,
                        replacement : (match, pl) => {
                            return '..';
                        }
                    },
                    {
                        match : /\/html\/sample/gi,
                        replacement : (match, pl) => {
                            return '../../html/sample';
                        }
                    },
                    {
                        match : /\/html\/other/gi,
                        replacement : (match, pl) => {
                            return '../../html/other';
                        }
                    },
                    {
                        match : /\/html\/page/gi,
                        replacement : (match, pl) => {
                            return '../../html';
                        }
                    }
                ]
            }))
            .pipe(plugins.using())
            .pipe(gulp.dest(paths.distGuide));

        return merge( js, css, html );
    }

    function productBuildOther(){
        const regex = /(?<=src\/html\/other\/)/gi;
        const build = htmlBuild('other', paths.htmlOtherFile, paths.distOtherHtml, regex);
        return build;
    }

    function productBuildSample(){
        const regex = /(?<=src\/html\/sample\/)/gi;
        const html = htmlBuild('sample', paths.htmlSampleFile, paths.distSampleHtml, regex);
        const css =  gulp
            .src(paths.scssSampleFile)
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.sass(scssOptions).on('error', plugins.sass.logError))
            .pipe(plugins.using())
            .pipe(gulp.dest((file) => {
                const filePath = file.path.replace('src','dist');
                // console.log(file.base);
                // path.join(file.base, './dist')
                return path.join(paths.distSampleHtml, './') // ← Put your folder path here
            }));
        const image = gulp
            .src(paths.imageSampleFile)
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.using())
            .pipe(gulp.dest((file) => {
                const filePath = file.path.replace('src','dist');
                // console.log(file.base);
                // path.join(file.base, './dist')
                return path.join(paths.distSampleHtml, './') // ← Put your folder path here
            }));

        return merge( html, css, image );
    }

    gulp.task('product_all', gulp.parallel(productHtml, productStaticCss, productCss, productJs, productImage, productFont, productVideo, productBuildSample, productBuildGuide, productBuildOther));
    gulp.task('product_build', gulp.parallel(productHtml, productStaticCss, productCss, productJs, productImage, productFont, productVideo));
    gulp.task('product_build-sample', productBuildSample);
    gulp.task('product_build-other', productBuildOther);
    gulp.task('product_build-guide', productBuildGuide);
    gulp.task('product_html', productHtml);
    gulp.task('product_css', gulp.parallel(productStaticCss, productCss));
    gulp.task('product_css-min', gulp.series(gulp.parallel(productStaticCss, productCss), productCssMin));
    gulp.task('product_js', productJs);
    gulp.task('product_js-min', gulp.series(gulp.parallel(productJsMinDel, productJs), productJsMin));
    gulp.task('product_js-min-del', productJsMinDel);
    gulp.task('product_js-babel', productJsBabel);
    gulp.task('product_font', productFont);
    gulp.task('product_image', productImage);
    gulp.task('product_video', productVideo);
}