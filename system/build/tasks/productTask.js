import { envSet, manageEnvironment } from "../modules/manageEnvironment";
import {loadPreviewLanguagePath, loadPreviewPath as previewPath} from "../../server/render/nodePath";

export default ( $, options ) => {

    envSet($);
    //배너 정보를 css에 추가하려면 $.header 주석 제거
    const banner = [
        "/**",
        " * @project        <%= pkg.name %>",
        " * @author         <%= pkg.author %>",
        " * @description    <%= pkg.description %>",
        " * @build          " + $.moment().format("llll") + " ET",
        // " * @release        " + $.gitRevSync.long() + " [" + $.gitRevSync.branch() + "]",
        " * @copyright      Copyright (c) " + $.moment().format("YYYY") + ", <%= pkg.copyright %>",
        " */",
        ""
    ].join("\n");

    const scssOptions = {
        includePaths : [options.paths.dependencyStyle],
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
        let path = $.path.join(file.history[0].replace('.html','.json'));
        let jsonData;

        // if(file.history[0].indexOf('.html') !== -1){
        //     path = $.path.join(file.history[0].replace('.html','.json'));
        // }

        if($.fs.existsSync(path)){
            // console.log(`file exists`);
            jsonData = JSON.parse($.fs.readFileSync(path, 'utf8'));

            const footerPath =  $.path.join(options.paths.html,'/common/footer.json');
            if($.fs.existsSync(footerPath)){
                const footerJson = JSON.parse($.fs.readFileSync(footerPath, 'utf8'));
                Object.assign(jsonData,footerJson);
            }

            const headerPath =  $.path.join(options.paths.html,'/common/header.json');
            if($.fs.existsSync(headerPath)){
                const headerJson = JSON.parse($.fs.readFileSync(headerPath, 'utf8'));
                Object.assign(jsonData,headerJson);
            }
        }else{
            // console.log(`dont't file exists`);
            if(file.history[0].indexOf('@guide') !== -1){
                path =  $.path.join(options.paths.IA);
                jsonData = JSON.parse($.fs.readFileSync(path, 'utf8'));

                const glob = $.globby.sync(options.paths.pageHtml,{
                    expandDirectories: {
                        extensions: ['html']
                    }
                });

                const data = previewPath($, options, glob);
                jsonData.compNode = data;

                const glob2 = $.globby.sync(options.paths.sampleHtml,{
                    expandDirectories: {
                        extensions: ['html']
                    }
                });

                const data2 = previewPath($, options, glob2);
                jsonData.guideNode = data2;

                const glob3 = $.globby.sync(options.paths.otherHtml,{
                    expandDirectories: {
                        extensions: ['html']
                    }
                });
                const data3 = previewPath($, options, glob3);
                jsonData.otherNode = data3;
            }else{
                jsonData = '';
            }
        }
        return jsonData;
    }

    function getGuideDataForFile(file){
        const path = options.paths.IA;
        let jsonData;
        if($.fs.existsSync(path)){
            // console.log(`file exists`);
            jsonData = JSON.parse($.fs.readFileSync(path, 'utf8'));

            const glob = $.globby.sync(options.paths.pageHtml,{
                expandDirectories: {
                    extensions: ['html']
                }
            });

            const data = previewPath($, options, glob);
            jsonData.compNode = data;

            const glob2 = $.globby.sync(options.paths.sampleHtml,{
                expandDirectories: {
                    extensions: ['html']
                }
            });

            const data2 = previewPath($, options, glob2);
            jsonData.guideNode = data2;

            const glob3 = $.globby.sync(options.paths.otherHtml,{
                expandDirectories: {
                    extensions: ['html']
                }
            });
            const data3 = previewPath($, options, glob3);
            jsonData.otherNode = data3;
        }else{
            // console.log(`dont't file exists`);
            jsonData = '';
        }
        return jsonData;
    }

    function htmlBuild(title, filePath, destPath, regex){
        $.fancyLog(`-> Building Product Nunjucks To ${title}`);
        // $.del(options.paths.distHtml);

        let relativePath = '';
        return $.gulp
            .src(filePath)
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.data(getDataForFile))
            .pipe($.nunjucksRender({
                envOptions: {
                    autoescape: false
                },
                path: [
                    options.paths.src
                ],
                manageEnv : manageEnvironment
            }))
            .on('error', (e) => {
                console.log(e);
                this.emit('end');
            })
            .pipe($.prettyHtml())
            //removeComments : html 파일에서 모든 주석 제거, removeSpaces html 파일에서 중복된 공백제거
            .pipe($.removeEmptyLines())
            .pipe($.if($.relativePath, $.tap((file, t) => {
                const filePath = file.path.replace(/\\/g, '/');
                const path = filePath.substring(regex.exec(filePath).index);
                const len = path.match(/\//g) ? path.match(/\//g).length + 1 : 1;
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
            .pipe($.if($.relativePath, $.replaceTask({
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
            .pipe($.using())
            .pipe($.gulp.dest(destPath));
    }

    function productHtml(){
        $.fancyLog("-> Building Product Nunjucks To Html");
        // $.del(options.paths.distHtml);
        const regex = /(?<=src\/html\/page\/)/gi;
        const build = htmlBuild('html', options.paths.htmlFile, options.paths.distHtml, regex);
        return build;
    }

    function productStaticCss(){
        return $.gulp
            .src(options.paths.cssStaticFile, {since: $.gulp.lastRun(productStaticCss)})
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distStaticCss));
    }

    function productCss(){
        $.fancyLog("-> Building Product Sass To Css");

        const regex = /(?<=src\/css\/)/gi;
        let relativePath = '';
        return $.gulp
            .src(options.paths.scssFile, {since: $.gulp.lastRun(productCss)})
            //오류로 인한 파이프 깨짐 방지
            // SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
            .pipe($.sass(scssOptions).on('error', $.sass.logError))
            .pipe($.using())
            .pipe($.autoprefixer({remove: false}))
            // .pipe($.header(banner, {pkg: $.pkg}))
            .pipe($.if($.relativePath, $.tap((file, t) => {
                const filePath = file.path.replace(/\\/g, '/');
                const path = filePath.substring(regex.exec(filePath).index);
                const len = path.match(/\//g) ? path.match(/\//g).length + 1 : 1;
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
            .pipe($.if($.relativePath, $.replaceTask({
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
            .pipe($.gulp.dest(options.paths.distCss));
    }

    function productCssMin(){
        $.fancyLog("-> Building Product Css Minify");

        return $.gulp
            .src(options.paths.disCssFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.newer(options.paths.distCss + 'all.min.css'))
            // .pipe($.print())
            .pipe($.concat('all.min.css'))
            //css minify
            .pipe($.cssnano({
                discardComments: {
                    removeAll: true
                },
                discardDuplicates: true,
                discardEmpty: true,
                minifyFontValues: true,
                minifySelectors: true
            }))
            // .pipe($.header(banner, {pkg: $.pkg}))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distCss));
    }

    function productJs(done){
        $.fancyLog("-> Building Product Js");

        const js = $.gulp
            .src(options.paths.jsFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            // source stream 상의 파일들이 dist 폴더의 결과물보다 더 최신의 timestamp를 가진 경우에만 스크립으로 흘려보낸다. gulp-cached와는 달리 파일 변경 감지를 하지 않은 케이스에서 사용
            .pipe($.newer(options.paths.distJs))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distJs));

        const dependency =  $.gulp
            .src(options.paths.dependencyScriptFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            // source stream 상의 파일들이 dist 폴더의 결과물보다 더 최신의 timestamp를 가진 경우에만 스크립으로 흘려보낸다. gulp-cached와는 달리 파일 변경 감지를 하지 않은 케이스에서 사용
            .pipe($.newer(options.paths.distDependencyScript))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distDependencyScript));

        return $.merge( js, dependency );
    }
    function productJsMin(){
        $.fancyLog("-> Building Product min.js");

        const js =  $.gulp
            .src([options.paths.disJsFile, '!' + options.paths.disJsMinFile])
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.uglify())
            .pipe($.rename((path) => {
                path.dirname += '/min';
                path.basename += '.min';
                path.extname = '.js'
            }))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distJs));

        const dependency =  $.gulp
            .src([options.paths.distDependencyScriptFile, '!' + options.paths.distDependencyScriptMinFile])
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.uglify())
            .pipe($.rename((path) => {
                path.dirname += '/min';
                path.basename += '.min';
                path.extname = '.js'
            }))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distDependencyScript));

        return $.merge( js, dependency );
    }

    function productJsMinDel(done){
        $.fancyLog("-> Building Product Delete min.js");
        $.del($.path.join(options.paths.dist,'**','min'));

        done();
    }

    function productJsBabel(){
        $.fancyLog("-> Transpiling Javascript via Babel...");

        const js = $.gulp
            .src(options.paths.jsFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            // source stream 상의 파일들이 dist 폴더의 결과물보다 더 최신의 timestamp를 가진 경우에만 스크립으로 흘려보낸다.
            .pipe($.newer(options.paths.distJs))
            .pipe($.babel())
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distJs));

        const dependency =  $.gulp
            .src(options.paths.dependencyScriptFile)
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.newer(options.paths.distDependencyScript))
            .pipe($.babel())
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distDependencyScript));

        return $.merge( js, dependency )
    }

    function productImage(){
        return $.gulp
            .src(options.paths.imageFile, { since: $.gulp.lastRun(productImage) })
            // .pipe($.imagemin({
            //     progressive: true,
            //     interlaced: true,
            //     optimizationLevel: 8,
            //     svgoPlugins: [{removeViewBox: false}],
            //     verbose: true,
            //     use: []
            // }))
            .pipe($.newer(options.paths.distImage))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distImage));
    }

    function productFont(){
        return $.gulp
            .src(options.paths.dependencyFont, { since: $.gulp.lastRun(productFont) })
            .pipe($.newer(options.paths.distDependencyFont))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distDependencyFont));
    }

    function productVideo(){
        return $.gulp
            .src(options.paths.videoFile, { since: $.gulp.lastRun(productVideo) })
            .pipe($.newer(options.paths.distVideo))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distVideo));
    }

    function productBuildGuide(){
        const js = $.gulp
            .src(options.paths.guideJsFile)
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distGuideJs));
        const css = $.gulp
            .src(options.paths.guideCssFile)
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distGuideCss));
        const html = $.gulp
            .src(options.paths.guideHtmlFile)
            //오류로 인한 파이프 깨짐 방지
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.data(getGuideDataForFile))
            .pipe($.nunjucksRender({
                envOptions: {
                    autoescape: false
                },
                path: [
                    options.paths.src
                ],
                manageEnv : manageEnvironment
            }))
            .on('error', (e) => {
                console.log(e);
                this.emit('end');
            })
            .pipe($.prettyHtml())
            //removeComments : html 파일에서 모든 주석 제거, removeSpaces html 파일에서 중복된 공백제거
            .pipe($.removeEmptyLines())
            .pipe($.replaceTask({
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
            .pipe($.using())
            .pipe($.gulp.dest(options.paths.distGuide));

        return $.merge( js, css, html );
    }

    function productBuildOther(){
        const regex = /(?<=src\/html\/other\/)/gi;
        const build = htmlBuild('other', options.paths.htmlOtherFile, options.paths.distOtherHtml, regex);
        return build;
    }

    function productBuildSample(){
        const regex = /(?<=src\/html\/sample\/)/gi;
        const html = htmlBuild('sample', options.paths.htmlSampleFile, options.paths.distSampleHtml, regex);
        const css =  $.gulp
            .src(options.paths.scssSampleFile)
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.sass(scssOptions).on('error', $.sass.logError))
            .pipe($.using())
            .pipe($.gulp.dest((file) => {
                const path = file.path.replace('src','dist');
                // console.log(file.base);
                // $.path.join(file.base, './dist')
                return $.path.join(options.paths.distSampleHtml, './') // ← Put your folder path here
            }));
        const image =  $.gulp
            .src(options.paths.imageSampleFile)
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.using())
            .pipe($.gulp.dest((file) => {
                const path = file.path.replace('src','dist');
                // console.log(file.base);
                // $.path.join(file.base, './dist')
                return $.path.join(options.paths.distSampleHtml, './') // ← Put your folder path here
            }));

        return $.merge( html, css, image );
    }

    $.gulp.task('product_all', $.gulp.parallel(productHtml, productStaticCss, productCss, productJs, productImage, productFont, productVideo, productBuildSample, productBuildGuide, productBuildOther));
    $.gulp.task('product_build', $.gulp.parallel(productHtml, productStaticCss, productCss, productJs, productImage, productFont, productVideo));
    $.gulp.task('product_build-sample', productBuildSample);
    $.gulp.task('product_build-other', productBuildOther);
    $.gulp.task('product_build-guide', productBuildGuide);
    $.gulp.task('product_html', productHtml);
    $.gulp.task('product_css', $.gulp.parallel(productStaticCss, productCss));
    $.gulp.task('product_css-min', $.gulp.series($.gulp.parallel(productStaticCss, productCss), productCssMin));
    $.gulp.task('product_js', productJs);
    $.gulp.task('product_js-min', $.gulp.series($.gulp.parallel(productJsMinDel, productJs), productJsMin));
    $.gulp.task('product_js-min-del', productJsMinDel);
    $.gulp.task('product_js-babel', productJsBabel);
    $.gulp.task('product_font', productFont);
    $.gulp.task('product_image', productImage);
    $.gulp.task('product_video', productVideo);

}