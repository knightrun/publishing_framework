import loadMoudle from './system/loadModule';

const options = {
    relativePath : false, // build시 상대경로 변환
    multilingual : false, // 다국어 설정
    lang : ['ko','en'] // multilingual: true 일때만 사용되며 html/page 하위 다국어 폴더명과 동일하게 작성
}

export { options };

loadMoudle();