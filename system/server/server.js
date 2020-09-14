import manageEnvironment from "./render/manageEnvironment";
import { router, routerSet, jsonDataSet } from "./render/router";
import { loadPreviewPath, loadPreviewLanguagePath } from "./render/nodePath";

const port = 3000;
let jsonData,
    app;

function severSet( $, options ){
    app = $.express();

    const env = $.nunjucks.configure(options.paths.src, {
        autoescape: true,
        noCache : true,
        express: app
    });

    manageEnvironment(env, $);
    routerSet($, options);

    app.use((req, res, next) => {
        // const template = $.fs.readFileSync(options.paths.src + req.url).toString();
        // console.log(template);
        const url = req.url;

        //resource가 다 호출되기때문에 html에서만 분기
        // if(url.indexOf('.html') !== -1){
        //     const path = $.path.join(options.paths.src, url);
        //     const str = $.fs.readFileSync(path).toString();
        //     let renderStr = $.nunjucks.renderString(str);
        //     renderStr = $.pretty(renderStr,{indent_size:4});
        // }

        next();
    });

    app.use((req, res, next) => {
        const url = req.url;
        let path;
        //resource가 다 호출되기때문에 html에서만 분기
        if(url.indexOf('.html') !== -1){
            path = $.path.join(options.paths.src + req.url).replace('.html','.json');
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
                if(url.indexOf('@guide') !== -1){
                    path =  $.path.join(options.paths.IA);
                    jsonData = JSON.parse($.fs.readFileSync(path, 'utf8'));

                    const glob = $.globby.sync(options.paths.pageHtml,{
                        expandDirectories: {
                            extensions: ['html']
                        }
                    });

                    const data = loadPreviewPath($, options, glob);
                    jsonData.compNode = data;

                    const glob2 = $.globby.sync(options.paths.sampleHtml,{
                        expandDirectories: {
                            extensions: ['html']
                        }
                    });

                    const data2 = loadPreviewPath($, options, glob2);
                    jsonData.guideNode = data2;

                    const glob3 = $.globby.sync(options.paths.otherHtml,{
                        expandDirectories: {
                            extensions: ['html']
                        }
                    });

                    const data3 = loadPreviewPath($, options, glob3);
                    jsonData.otherNode = data3;

                }else{
                    jsonData = '';
                }
                // console.log(`dont't file exists`);
            }
            jsonDataSet( jsonData );
        }

        next();
    });

    app.use('/',router);

    app.use($.express.static(options.paths.src));

    app.use((req, res, next) => { // 404 처리 부분
        res.status(404).send('일치하는 주소가 없습니다!');
    });

    app.use((err, req, res, next) => { // 에러 처리 부분
        console.error(err.stack); // 에러 메시지 표시
        res.status(500).send('서버 에러!'); // 500 상태 표시 후 에러 메시지 전송
    });

    app.listen(port, () => {
        console.log(`start!!! Express listening on port ${port}`);
    });

    $.browserSync({
        proxy: `http://localhost:${port}/${options.paths.default}`,
        port: 4000
    });
}

export { app, port, severSet };