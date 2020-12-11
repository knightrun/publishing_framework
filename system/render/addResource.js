const addResource = {

    resourceRelativePathReplace : (url, template) => {
        const arr = url.split('/').filter(Boolean);
        let resource = template.replace(/\r/gi,'').split('\n');

        resource.forEach((str, index) => {
            // console.log(str, index);
            let match, reg;

            if(str.indexOf('src') !== -1){
                // console.log('javascript');
                reg = `<script[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>`;
            }else if(str.indexOf('href') !== -1){
                // console.log('css');
                reg = `<link[^>]*href=[\"']?([^>\"']+)[\"']?[^>]*>`;

            }else{
                return false;
            }

            match = str.match(reg)[1].split('/');

            if(arr.length > match.length){
                const count = arr.length - match.length;

                for(let i = 0;i<match.length;i++){
                    if(match[i] === arr[i]){
                        match[i] = '';
                    }else{
                        for(let j = 0;j<count;j++){
                            match.splice(i + j,0,'..');
                        }
                        break;
                    }
                }

                const path = match.filter(Boolean).toString().replace(/,/g,'/');
                template = template.replace(str,str.replace(str.match(reg)[1], path));
            }
        });

        resource.length = 0;
        arr.length = 0;

        return template;
    }
};