import path from 'path';

const root = process.cwd();
const paths = {
    default : path.join(`/@guide/basic/basic.html`),
    tasks : './system/',
    settings : path.join(root,`/system/settings`),
    system : path.join(root,`/system`),
    server : path.join(root,`/system/server/server.js`),
    src : path.join(root,`/src`),
    IA : path.join(root,`/src/@guide/IA.json`),
    guide : path.join(root,`/src/@guide`),
    guideCss : path.join(root,`/src/@guide/css`),
    guideJs : path.join(root,`/src/@guide/js`),
    guideHtmlFile : path.join(root,`/src/@guide/**/*.{html,htm,twig}`),
    guideCssFile : path.join(root,`/src/@guide/css/**/*.css`),
    guideJsFile : path.join(root,`/src/@guide/js/**/*.js`),
    project : path.join(root,`/src`),
    resource : path.join(root,`/src/html/common/head.html`),
    html : path.join(root,`/src/html`),
    pageHtml : path.join(root,`/src/html/page`).replace(/\\/g, '/'),
    sampleHtml : path.join(root,`/src/html/sample`).replace(/\\/g, '/'),
    otherHtml : path.join(root,`/src/html/other`).replace(/\\/g, '/'),
    css : path.join(root,`/src/css`),
    js : path.join(root,`/src/js`),
    htmlOtherFile : path.join(root,`/src/html/other/**/*.{html,htm,twig}`),
    htmlSampleFile : path.join(root,`/src/html/sample/**/*.{html,htm,twig}`),
    scssSampleFile : path.join(root,`/src/html/sample/**/*.scss`).replace(/\\/g, '/'),
    cssSampleFile : path.join(root,`/src/html/sample/**/*.css`),
    imageSampleFile : path.join(root,`/src/html/sample/**/*.{jpg,png,gif,svg,ico}`),
    htmlFile : path.join(root,`/src/html/page/**/*.{html,htm,twig}`),
    scssFile : path.join(root,`/src/css/**/*.scss`).replace(/\\/g, '/'),
    cssFile : path.join(root,`/src/css/**/*.css`),
    cssStaticFile : path.join(root,`/src/css/static/**/*.css`),
    jsFile : path.join(root,`/src/js/**/*.js`),
    jsonFile : path.join(root,`/src/html/page/**/*.json`),
    videoFile : path.join(root,`/src/videos/**/*.mp4`),
    dependency : path.join(root,`/src/dependency`),
    dependencyStyle : path.join(root,`/src/dependency/styles`),
    dependencyStyleFile : path.join(root,`/src/dependency/styles/**/*.scss`).replace(/\\/g, '/'),
    dependencyScript : path.join(root,`/src/dependency/scripts`),
    dependencyScriptFile : path.join(root,`/src/dependency/scripts/**/*.js`),
    dependencyFont : path.join(root,`/src/dependency/fonts/**/*.*`),
    imageFile : path.join(root,`/src/images/**/*.{jpg,png,gif,svg,ico}`),
    dist : path.join(root,`/dist/`),
    distGuide : path.join(root,`/dist/@guide`),
    distGuideCss : path.join(root,`/dist/@guide/css`),
    distGuideJs : path.join(root,`/dist/@guide/js`),
    distSampleHtml : path.join(root,`/dist/html/sample`),
    distOtherHtml : path.join(root,`/dist/html/other`),
    distHtml : path.join(root,`/dist/html`),
    distCss : path.join(root,`/dist/css`),
    distStaticCss : path.join(root,`/dist/css/static`),
    distJs : path.join(root,`/dist/js`),
    distImage : path.join(root,`/dist/images`),
    distVideo : path.join(root,`/dist/videos`),
    disCssFile : path.join(root,`/dist/css/**/*.css`),
    disJsFile : path.join(root,`/dist/js/**/*.js`),
    disJsMinFile : path.join(root,`/dist/js/**/*.min.js`),
    distDependencyScript : path.join(root,`/dist/dependency/scripts`),
    distDependencyScriptFile : path.join(root,`/dist/dependency/scripts/**/*.js`),
    distDependencyScriptMinFile : path.join(root,`/dist/dependency/scripts/**/*.min.js`),
    distDependencyFont : path.join(root,`/dist/dependency/fonts`)
};

export { paths };