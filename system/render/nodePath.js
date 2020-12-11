import path from 'path';
import fs from 'fs';
import { paths } from '../settings/paths';
import { options} from "../../gulpfile.babel";

function loadPreviewPath(src){
    const obj = {};

    src.forEach(data => {
        const dir = path.dirname(data);
        const base = path.basename(data, path.extname(data));
        const url = path.join(data).replace(paths.src,'');
        const lastDir = dir.split('/').pop();
        const jsonUrl = data.replace('.html','.json');
        let jsonData = '';
        if(fs.existsSync(jsonUrl)) {
            // console.log(`file exists`);
            jsonData = JSON.parse(fs.readFileSync(jsonUrl, 'utf8'));
            // console.log(jsonData.progress);
        }
        const fileObj = {
            base : base,
            url : url.replace(/\\/gi, '/'),
            progress : jsonData.progress,
            remarks : jsonData.remarks,
            category : jsonData.category
        };

        if(obj[lastDir] == null){
            obj[lastDir] = [];
        }

        obj[lastDir].push(fileObj);

        // console.log(lastDir);
        // obj[lastDir] = obj[lastDir] || '';
        // console.log(data.replace(paths.pageHtml,''));
    });

    const arr = [];

    for( const item in obj ){
        const nodeObj = {};
        nodeObj.name = item;
        nodeObj.list = obj[item];
        arr.push(nodeObj);
    }
    return arr;
}

function loadPreviewLanguagePath(src){
    const obj = {};

    for (const lang of options.lang) {
        obj[lang] = {};
    }

    src.forEach(data => {
        const dir = path.dirname(data);
        const base = path.basename(data, path.extname(data));
        const url = path.join(data).replace(paths.src,'');
        const lastDir = dir.split('/').pop();
        const jsonUrl = data.replace('.html','.json');
        let jsonData = '';
        if(fs.existsSync(jsonUrl)) {
            // console.log(`file exists`);
            jsonData = JSON.parse(fs.readFileSync(jsonUrl, 'utf8'));
            // console.log(jsonData.progress);
        }
        const fileObj = {
            base : base,
            url : url.replace(/\\/gi, '/'),
            progress : jsonData.progress,
            remarks : jsonData.remarks,
            category : jsonData.category
        };

        const filter = options.lang.filter(item => fileObj.url.includes(`/${item}/`))
        fileObj.lang = filter[0];

        if(obj[fileObj.lang][lastDir] == null){
            obj[fileObj.lang][lastDir] = [];
        }

        obj[fileObj.lang][lastDir].push(fileObj);

        // console.log(lastDir);
        // obj[lastDir] = obj[lastDir] || '';
        // console.log(data.replace(paths.pageHtml,''));
    });

    const langObj = {};

    for (const lang of options.lang) {
        const arr = [];
        for( const item in obj[lang] ){
            const nodeObj = {};
            nodeObj.name = item;
            nodeObj.list = obj[lang][item];
            arr.push(nodeObj);
        }
        langObj[lang] = arr;
    }

    return langObj;
}

export { loadPreviewPath, loadPreviewLanguagePath };