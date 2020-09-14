import cliReporter from '../../../node_modules/pa11y/reporter/cli.js'

const IA = [
    {
        url : '/main/main.html'
    },
    {
        url : '/sub/sub.html'
    }
];

// 배열에 있는 데이터를 순차적으로 처리합니다
// nths 아이템 콜벡이후에 n_1 아이템을 이동하면서 말이죠
function doSynchronousLoop(data, processData, done) {
    if (data.length > 0) {
        const loop = (data, i, processData, done) => {
            processData(data[i], i, () => {
                if (++i < data.length) {
                    loop(data, i, processData, done);
                } else {
                    done();
                }
            });
        };
        loop(data, 0, processData, done);
    } else {
        done();
    }
}

export default ( $, options ) => {
    function processAccessibility(element, i, callback) {
        const accessibilitySrc = $.path.join(options.paths.distHtml + element.url);
        const option = {
            log: cliReporter,
            ignore:
                [
                    'notice',
                    'warning'
                ],
        };
        const test = $.pa11y(option);
        $.fancyLog("-> Checking Accessibility for URL: " + $.chalk.cyan(accessibilitySrc));
        test.run(accessibilitySrc, (error, results) => {
            cliReporter.results(results, accessibilitySrc);
            callback();
        });
    }

    // 접근성 검사 : https://nystudio107.com/blog/making-websites-accessible-americans-with-disabilities-act-ada
    function  accessibility(callback) {
        doSynchronousLoop(IA, processAccessibility, () => {
            // all done
            callback();
        });
    }

    $.gulp.task('product : local - accessibility', accessibility);
}