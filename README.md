# 템플릿 엔진을 사용하여 보다 정교하고 다양한 퍼블리싱을 위한 오픈소스 프레임워크
복수의 레이아웃 제작 할수 있으면 extends 하여 페이지내에서 사용 가능합니다. 공통으로 사용되는 코드나 컴포넌트를 import 하여 재사용 가능합니다. html과 동일한 이름을 가진 json 파일을 필수로 제작 해야 하며 json에 있는 데이터는 자동으로 html로 로드되어 
템플릿 문법으로 출력 가능합니다. 최종소스는 템플릿 소스를 일반적인 퍼블리싱 소스로 변환되어 제공됩니다. 

## 구성요소
* [Node.js 12.x](https://nodejs.org/ko/)
* [Express](https://www.npmjs.com/package/express)
* [Gulp 4.0](https://www.npmjs.com/package/gulp)
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* [Sass](https://www.npmjs.com/package/node-sass)
* [yarn](https://github.com/yarnpkg/yarn)

## 설치
```javascript
git clone 실행 후

npm install

또는 

yarn install or yarn
```

**터미널에서 node-sass 에러가 발생했을때에는 node-sass를 별로도 설치해야 합니다.**
```javascript
npm install node-sass
```

## Task 
```bash
# 웹서버 실행
local : 1. run server

# scss 파일의 변경을 감지하여 변경될 때마다 scss 파일을 컴파일하여 css 파일을 자동 업데이트
local : 2. run sass_watch

# css폴더의 scss 파일을 컴파일하여 css 파일을 업데이트 (변경 감지x)
local : sass - compile

# sample폴더의 scss 파일을 컴파일하여 css 파일을 업데이트 (변경 감지x)
local : sass - compile_sample

# 전체 파일 dist 디렉토리 배포 
product : all

# 정적페이지 관련파일 dist 디렉토리 배포
product : build

# 가이드페이지 관련파일 dist 디렉토리 배포
product : build - guide

# 기타페이지 관련파일 dist 디렉토리 배포
product : build - other

# 샘플페이지 관련파일 dist 디렉토리 배포
product : build - sample

# css파일 dist 디렉토리 배포
product : css

# css파일 dist 디렉토리 배포후 코드 경량화 실행 (all.min.css)
product : css - min

# font파일 dist 디렉토리 배포
product : font

# html파일 dist 디렉토리 배포
product : html

# image파일 dist 디렉토리 배포
product : image

# js파일 dist 디렉토리 배포
product : js

# js파일 dist 디렉토리 배포 후 babel 실행
product : js - babel

# js파일 dist 디렉토리 배포 후 /min 폴더 생성후 파일명.min.js로 압축 
product : js - min

# /min 폴더 지우기
product : js - min_del

# video파일 dist 디렉토리 배포
product : video
```
**빌더 실행시 local : 1. run server, local : 2. run sass_watch를 실행하면 됩니다.** 

## 디렉토리

* ### @guide
  - 가이드페이지에 관련 파일을 포함하는 디렉토리
  
* ### css
  - 스타일 관련 파일을 포함하는 디렉토리
  
* ### dependency
  - #### elements
    + Nunjucks - macro 관련 파일을 포함하는 디렉토리
  - #### fonts
    + 공통 폰트 파일을 포함하는 디렉토리
  - #### scripts
    + 공통 스크립트 파일을 포함하는 디렉토리
  - #### styles
    + 공통 Sass - import, mixin 관련 파일을 포함하는 디렉토리
    
* ### html
  - #### common
    + 공통 HTML 파일을 포함하는 디렉토리
  - #### layout
    + 공통 레이아웃 HTML 파일을 포함하는 디렉토리
  - #### other
    + 기타페이지 HTML 파일을 포함하는 디렉토리
  - #### page
    + 정적페이지 HTML 파일을 포함하는 디렉토리
  - #### sample
    + 샘플페이지 HTML 파일을 포함하는 디렉토리
  
* ### images
  - 이미지 파일을 포함하는 디렉토리
  
* ### video
  - 동영상 파일을 포함하는 디렉토리
  
* ### js
  - 정적 페이지 스크립트 파일을 포함하는 디렉토리

* ### system
  - 빌더 관련 파일을 포함하는 디렉토리
  
## 빌더 관련 스크립트
* ### Gulpfile.babel.js     
  - relativePath : dist 디렉토리로 배포시 정적 페이지안의 css나 js같은 리소스 경로를 절대경로나 상대경로로 지정할 수 있습니다.
  
* ### 다국어 프로젝트인 경우 가이드 페이지와 관련된 코드를 수정해주셔야 합니다.    
  - server.js에서 loadPreviewPath 로 실행되는 부분을 loadPreviewLanguagePath 함수로 바꿔 주세요. 
  - nodePath.js에서 loadPreviewLanguagePath 함수부분을 다국어에 맞춰서 Object를 수정해주세요.
  - @guide/page에서 페이지를 각각 구분해주세요 예)page_ko.html, page_en.html
  - page의 코드에서 compNode를 각 코드에 맞게 바꿔주세요. 예)compNode.ko, compNode.en
      
## 참고   
* **html/page, html/other, html/sample에서는 HTML 생성 후 동일한 이름의 JSON도 같은 위치에 생성해주세요.**   
* **dist 디렉토리 배포 명령을 실행했을 경우 dist폴더가 자동생성됩니다.** 
* **모든 파일 코드를 직접 커스텀하여 프로젝트에 맞게 재구성 하여 사용하셔도 무방합니다.** 


