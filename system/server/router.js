import express from 'express';
import { paths } from '../settings/paths';

let router,
    jsonData;

function jsonDataSet( data ){
    jsonData = data;
}

function routerSet() {
    router = express.Router();

    router.get('/', (req,res) => {
        // return res.render(options.paths.default);
    });

    router.get('*.html', (req, res) => {
        //listen과 render2번 호출됨
        // let requrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        return res.render( paths.src + req.url, jsonData );
    });
}

export { router, routerSet, jsonDataSet };

// import posts from './routes/posts';
// app.use('/posts', posts);