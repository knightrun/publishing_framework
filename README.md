# 퍼블리싱 프레임워크 
템플릿 엔진을 사용하여 보다 정교하고 다양한 퍼블리싱을 위한 오픈소스 프레임워크입니다. 다수의 레이아웃 제작 할 수 있으며 extends 하여 페이지내에서 사용 가능합니다. 공통으로 사용되는 코드나 컴포넌트를 /dependency/elements에서 제작 후 import 하여 재사용 가능합니다. json에 있는 데이터는 자동으로 html로 로드되어 
템플릿 문법으로 출력 가능합니다. 최종소스는 템플릿 소스를 일반적인 퍼블리싱 소스로 변환되어 제공됩니다. 또한 웹서버 실행시 가이드 페이지로 접속되며 가이드의 정적 페이지를 수정하여 산출물 가이드로 사용할 수 있습니다. 

## 구성요소
* [Node.js 12.x](https://nodejs.org/ko/)
* [Express](https://www.npmjs.com/package/express)
* [Gulp 4.0](https://www.npmjs.com/package/gulp)
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* [Sass](https://www.npmjs.com/package/node-sass)
* [yarn](https://github.com/yarnpkg/yarn)

## Installation
```javascript
git clone 실행 후

npm install

또는 

yarn install or yarn
```

**터미널에서 node-sass 에러가 발생했을때에는 node-sass를 별로도 설치해야 합니다.**
```javascript
yarn add node-sass 

또는

npm install node-sass
```

## Task 
```bash
# 로컬서버 실행
local : 1. run server

# /src 폴더의 .scss의 변경을 감지하여 .css로 자동 변환 (.scss 새로 생성시 task restart)
local : 2. run sass_watch

# /src/css 폴더의 .scss를 css로 변환 (변경 감지x)
local : sass - compile

# /src/html/sample 폴더의 .scss를 css로 변환 (변경 감지x)
local : sass - compile_sample

# /src/ 폴더의 전체파일을 /dist 디렉토리 배포 
product : all

# /src/html/page 관련 전체파일을 /dist 디렉토리로 배포
product : build

# /src/@guide 관련 전체파일을 /dist 디렉토리로 배포
product : build - guide

# /src/html/other 관련 전체파일을 /dist 디렉토리로 배포
product : build - other

# /src/html/sample 관련 전체파일을 /dist 디렉토리로 배포
product : build - sample

# /src의 .css를 /dist 디렉토리로 배포
product : css

# /src의 .css를 /dist 디렉토리로 배포 후 코드 경량화 실행 (all.min.css)
product : css - min

# /src/dependency/font 폴더의 전체파일을 /dist 디렉토리로 배포
product : font

# /src/html/page 폴더의 .html만 /dist 디렉토리로 배포
product : html

# /src/image 폴더의 전체파일을 /dist 디렉토리로 배포
product : image

# /src/js 폴더와 /src/dependency/scripts 폴더의 전체파일을 /dist 디렉토리로 배포
product : js

# /src/js 폴더의 전체파일을 /dist 디렉토리로 배포 후 babel 실행
product : js - babel

# /src/js 폴더의 전체파일을 /dist 디렉토리로 배포 후 /min 하위 폴더 생성후 파일명.min.js로 압축 
product : js - min

# /min 폴더 지우기
product : js - min_del

# /src/videos 폴더의 .mp4를 /dist 디렉토리로 배포 (확장자 추가 가능)
product : video
```

## Start the project
```javascript
local : 1. run server

local : 2. run sass_watch
```

## Directory
* ### @guide
  - 가이드페이지에 관련 파일을 포함하는 디렉토리
  
* ### css
  - 스타일 관련 파일을 포함하는 디렉토리
  
* ### dependency
  - #### /elements
    + Nunjucks - macro 관련 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
  - #### /fonts
    + 공통 폰트 파일을 포함하는 디렉토리
  - #### /scripts
    + 공통 스크립트 파일을 포함하는 디렉토리
  - #### /styles
    + 공통 Sass - import, mixin 관련 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
    
* ### html
  - #### /common
    + 공통 HTML 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
  - #### /layout
    + 공통 레이아웃 HTML 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
  - #### /page
    + 프로젝트 HTML 파일을 포함하는 디렉토리
  - #### /other
    + 프로젝트 외 별도의 HTML 파일을 포함하는 디렉토리
  - #### /sample
    + 샘플페이지 HTML 파일을 포함하는 디렉토리
  
* ### images
  - 이미지 파일을 포함하는 디렉토리
  
* ### videos
  - 동영상 파일을 포함하는 디렉토리
  
* ### js
  - 스크립트 파일을 포함하는 디렉토리

* ### system
  - 빌더 관련 파일을 포함하는 디렉토리
  
## Builder
* ### Gulpfile.babel.js     
  - relativePath : dist 디렉토리로 배포시 정적 페이지안의 css나 js같은 리소스 경로를 절대경로나 상대경로로 지정할 수 있습니다.
  
* ### 다국어 프로젝트인 경우 가이드 페이지와 관련된 코드를 수정해주셔야 합니다.    
  - server.js에서 loadPreviewPath 로 실행되는 부분을 loadPreviewLanguagePath 함수로 바꿔 주세요. 
  - nodePath.js에서 loadPreviewLanguagePath 함수부분을 다국어에 맞춰서 Object를 수정해주세요.
  - @guide/page에서 페이지를 각각 구분해주세요 예)page_ko.html, page_en.html
  - page의 코드에서 compNode를 각 코드에 맞게 바꿔주세요. 예)compNode.ko, compNode.en
      
## Reference   
* **html/page, html/other, html/sample에서는 HTML 생성 후 동일한 이름의 JSON도 같은 위치에 필수로 생성하게 제작되었습니다.**   
* **dist 배포 명령을 실행했을 경우 /dist 폴더가 자동생성 되며 Nunjuck 템플릿이 HTML로 변환되어 배포 됩니다.** 
* **샘플용 파일들이 첨부되어 있으며 사용하지 않는 파일은 삭제 해 주세요.** 
* **개인용도로 제작된 프레임워크인 만큼 프로젝트에 맞게 프레임워크를 재구성 하여 사용하셔야 합니다.** 


