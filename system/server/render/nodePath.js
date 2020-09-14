function loadPreviewPath($, options, src){
    const obj = {};
    src.forEach(function (data, index) {
        const dir = $.path.dirname(data);
        const base = $.path.basename(data, $.path.extname(data));
        const url = $.path.join(data).replace(options.paths.src,'');
        const lastDir = dir.split('/').pop();
        const path = data.replace('.html','.json');
        let jsonData = '';
        if($.fs.existsSync(path)) {
            // console.log(`file exists`);
            jsonData = JSON.parse($.fs.readFileSync(path, 'utf8'));
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
        // console.log(data.replace(options.paths.pageHtml,''));
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

function loadPreviewLanguagePath($, options, src){
    const obj = {en : {},ko : {}};
    src.forEach(function (data, index) {
        const dir = $.path.dirname(data);
        const base = $.path.basename(data, $.path.extname(data));
        const url = $.path.join(data).replace(options.paths.src,'');
        const lastDir = dir.split('/').pop();
        const path = data.replace('.html','.json');
        let jsonData = '';
        if($.fs.existsSync(path)) {
            // console.log(`file exists`);
            jsonData = JSON.parse($.fs.readFileSync(path, 'utf8'));
            // console.log(jsonData.progress);
        }
        const fileObj = {
            base : base,
            url : url.replace(/\\/gi, '/'),
            progress : jsonData.progress,
            remarks : jsonData.remarks,
            category : jsonData.category
        };

        if(fileObj.url.indexOf('/en/') !== -1){
            fileObj.lang = 'en';
        }else if(fileObj.url.indexOf('/ko/') !== -1){
            fileObj.lang = 'ko';
        }

        if(obj[fileObj.lang][lastDir] == null){
            obj[fileObj.lang][lastDir] = [];
        }

        obj[fileObj.lang][lastDir].push(fileObj);

        // console.log(lastDir);
        // obj[lastDir] = obj[lastDir] || '';
        // console.log(data.replace(options.paths.pageHtml,''));
    });
    // console.log(obj);
    const langObj = {};

    const arr = [];
    for( const item in obj.en ){
        const nodeObj = {};
        nodeObj.name = item;
        nodeObj.list = obj.en[item];
        arr.push(nodeObj);
    }
    langObj.en = arr;

    const arr2 = [];
    for( const item in obj.ko ){
        const nodeObj = {};
        nodeObj.name = item;
        nodeObj.list = obj.ko[item];
        arr2.push(nodeObj);
    }
    langObj.ko = arr2;

    return langObj;
}

export { loadPreviewPath, loadPreviewLanguagePath };