import express from 'express';
import nunjucks from "nunjucks";
import globby from 'globby';
import fs from 'fs';
import path from 'path';
import browserSync from 'browser-sync';
import manageEnvironment from "../render/manageEnvironment";
import { router, routerSet, jsonDataSet } from "./router";
import { loadPreviewPath, loadPreviewLanguagePath } from "../render/nodePath";
import { paths } from '../settings/paths';
import { options } from "../../gulpfile.babel";

const port = 3000;
let jsonData,
    app;

function severSet(){
    app = express();

    const env = nunjucks.configure(paths.src, {
        autoescape: true,
        noCache : true,
        express: app
    });

    manageEnvironment(env);
    routerSet();

    app.use((req, res, next) => {
        // const template = fs.readFileSync(options.paths.src + req.url).toString();
        // console.log(template);
        const url = req.url;

        //resource가 다 호출되기때문에 html에서만 분기
        // if(url.indexOf('.html') !== -1){
        //     const path = path.join(options.paths.src, url);
        //     const str = fs.readFileSync(path).toString();
        //     let renderStr = nunjucks.renderString(str);
        //     renderStr = pretty(renderStr,{indent_size:4});
        // }

        next();
    });

    app.use((req, res, next) => {
        const url = req.url;
        let jsonUrl;
        //resource가 다 호출되기때문에 html에서만 분기
        if(url.indexOf('.html') !== -1){
            jsonUrl = path.join(paths.src + req.url).replace('.html','.json');
            if(fs.existsSync(jsonUrl)){
                // console.log(`file exists`);
                jsonData = JSON.parse(fs.readFileSync(jsonUrl, 'utf8'));

                const footerPath =  path.join(paths.html,'/common/footer.json');
                if(fs.existsSync(footerPath)){
                    const footerJson = JSON.parse(fs.readFileSync(footerPath, 'utf8'));
                    Object.assign(jsonData,footerJson);
                }

                const headerPath =  path.join(paths.html,'/common/header.json');
                if(fs.existsSync(headerPath)){
                    const headerJson = JSON.parse(fs.readFileSync(headerPath, 'utf8'));
                    Object.assign(jsonData,headerJson);
                }

            }else{
                if(url.indexOf('@guide') !== -1){
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
                // console.log(`dont't file exists`);
            }
            jsonDataSet( jsonData );
        }

        next();
    });

    app.use('/',router);

    app.use(express.static(paths.src));

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

    browserSync({
        proxy: `http://localhost:${port}/${paths.default}`,
        port: 4000
    });
}

export { app, port, severSet };