# 퍼블리싱 프레임워크 
> 자바스크립트 템플릿 엔진을 사용하여 보다 정교하고 다양한 웹 페이지 제작을 위한 오픈소스 퍼블리싱 프레임워크입니다.
> * 반복되는 HTML을 템플릿으로 쉽게 재사용할 수 있습니다. ex) layout, header, footer, component
> * Sass로 가독성이 높고 재사용에 유리한 CSS를 생성할 수 있습니다.
> * 기본적인 산출물 가이드 페이지를 제공하고 있습니다.

## 구성요소
* [Node.js 12.x](https://nodejs.org/ko/)
* [Express](https://www.npmjs.com/package/express)
* [Gulp 4.0](https://www.npmjs.com/package/gulp)
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* [Sass](https://www.npmjs.com/package/node-sass)
* [yarn](https://github.com/yarnpkg/yarn)
***

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
========== 개발 서버 ==========

# 서버 실행
dev_run-server

# /src 폴더의 .scss의 변경을 감지하여 .css로 자동 변환 (.scss 새로 생성시 task restart)
dev_run-sass-watch

# /src/css 폴더의 .scss를 css로 변환 (변경 감지x)
dev_sass-compile

# /src/html/sample 폴더의 .scss를 css로 변환 (변경 감지x)
dev_sass-compile-sample


========== 전체 빌드 ==========

# /src/ 폴더의 전체파일을 /dist 디렉토리 배포 
product_all

# /src/html/page 관련 전체파일을 /dist 디렉토리로 배포
product_build

# /src/html/sample 관련 전체파일을 /dist 디렉토리로 배포
product_build-sample

# /src/html/other 관련 전체파일을 /dist 디렉토리로 배포
product_build-other

# /src/@guide 관련 전체파일을 /dist 디렉토리로 배포
product_build-guide


========== 개별 빌드 ==========

# /src/html/page 폴더의 .html만 /dist 디렉토리로 배포
product_html

# /src의 .css를 /dist 디렉토리로 배포
product_css

# /src의 .css를 /dist 디렉토리로 배포 후 모든 css 코드를 하나의 파일로 압축 (all.min.css)
product_css-min

# /src/js 폴더와 /src/dependency/scripts 폴더의 전체파일을 /dist 디렉토리로 배포
product_js

# /src/js 폴더의 전체파일을 /dist 디렉토리로 배포 후 /min 하위 폴더 생성후 파일명.min.js로 압축 
product_js-min

# /min 폴더 지우기
product_js-min-del

# /src/js 폴더의 전체파일을 /dist 디렉토리로 배포 후 babel 실행
product_js-babel

# /src/dependency/font 폴더의 전체파일을 /dist 디렉토리로 배포
product_font

# /src/image 폴더의 전체파일을 /dist 디렉토리로 배포
product_image

# /src/videos 폴더의 .mp4를 /dist 디렉토리로 배포 (확장자 추가 가능)
product_video
```

## Start the project
```bash
1. dev_run-server
2. dev_run-sass-watch
```

## Directory
* ### @guide
  - 가이드페이지에 관련 파일을 포함하는 디렉토리
  
* ### css
  - 스타일 관련 파일을 포함하는 디렉토리
  - **`/static`** : plugin 관련 css나 static css 파일을 포함하는 디렉토리
    
* ### dependency
  - **`/elements`** : Nunjucks - macro 관련 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
  - **`/fonts`** : 공통 폰트 파일을 포함하는 디렉토리
  - **`/scripts`** : 공통 스크립트 파일을 포함하는 디렉토리
  - **`/styles`** : 공통 Sass - import, mixin 관련 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
    
* ### html
  - **`/common`** : 공통 HTML 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
  - **`/layout`** : 공통 레이아웃 HTML 파일을 포함하는 디렉토리 (build 시 /dist로 배포되지 않음)
  - **`/page`** : 프로젝트 HTML 파일을 포함하는 디렉토리
  - **`/other`** : 프로젝트 외 별도의 HTML 파일을 포함하는 디렉토리
  - **`/sample`** : 샘플페이지 HTML 파일을 포함하는 디렉토리
  
* ### images
  - 이미지 파일을 포함하는 디렉토리
  
* ### videos
  - 동영상 파일을 포함하는 디렉토리
  
* ### js
  - 스크립트 파일을 포함하는 디렉토리

* ### system
  - 빌더 관련 파일을 포함하는 디렉토리
***

## Reference   
* src내에서는 절대경로(필수)로 사용해주세요. 추후 빌드시 상대경로로 변환 가능합니다. 
* 다수의 레이아웃 제작 할 수 있으며 페이지에서 필요한 레이아웃을 선언하여 사용 가능합니다. 
* src/html 디렉토리의 모든 html파일에서 동일한 이름의 json 파일을 동일한 경로에 생성한 경우 json에 입력한 데이터가 자동으로 html로 로드되며 템플릿 문법으로 출력 가능합니다.
* json 파일에서 guide나 layout 관련 옵션을 설정할 수 있으며 json 파일을 생성 하지 않은 경우 header 와 footer가 import 되지 않습니다.  
* 공통으로 사용되는 코드를 /dependency/elements에서 컴포넌트화 하여 여러 페이지에서 import하여 재사용 가능합니다.
* scss가 아닌 plugin 관련 css나 static css는 반드시 css/static 안에 넣어주셔야 정상 배포 됩니다.
* dist 배포 명령을 실행했을 경우 /dist 폴더가 자동생성 되며 Nunjuck 템플릿이 HTML로 변환되어 배포 됩니다.
* web server 실행시 가이드 페이지로 접속되며 가이드의 정적 페이지를 수정하여 산출물 가이드로 사용할 수 있습니다. 
* 개인용도로 제작된 프레임워크인 만큼 프로젝트에 맞게 프레임워크를 재구성 하여 사용하셔야 합니다.
* 샘플용 파일들이 첨부되어 있으며 사용하지 않는 파일은 삭제 해 주세요.
***

## Default Json (src/html directory)   
```bash
{
    "page_title": "테스트",    // title tag 에 입력
    "progress" : "완료",  // guide의 페이지 진행상황
    "remarks" : "비고",   // guide의 페이지 비고
    "category" : "테스트 > 테스트",   // guide의 페이지 카테고리
    "layout" : {
        "header": true, // false시 header 불러오지 않음
        "footer": true, // false시 footer 불러오지 않음
        "class_container": "",  // .container에 추가로 넣을 클래스
        "class_main": "main",   // #main에 추가로 넣을 클래스
        "class_inner": "inner"  // #main > div에 추가로 넣을 클래스
    },
    "cssList" : ["customA, customB"], // 해당 페이지에서만 사용될 css 리스트
    "content" : "샘플"  // 내용
}
```

## Builder Options (gulpfile.babel.js) 
 - relativePath : src의 절대경로로 작업한 개발 소스(script src, css link, image src, css background-image 등)를 dist 배포시 상대경로로 변환 하여 배포할 수 있습니다.
 - multilingual : 다국어 설정을 할 수 있습니다.
 - lang : 사용할 다국어의 리스트를 작성합니다. 다국어가 설정되었을 경우 사용됩니다.
***

## 다국어 프로젝트 (폴더를 구분해야 하는경우)
  - gulpfile.babel.js 에서 multilingual를 true로 설정 한 후 lang 배열에 구분할 폴더 명을 작성해주세요
```bash
    multilingual : true,
    lang : ['ko','en']
```
  - src/html/page 에 다국어 폴더를 생성해 주세요. ※ 반드시 폴더만 생성해야 합니다.
```bash 
    ex) 📂 src
         ┗ 📂 html
            ┗ 📂 page
               ┗ 📂 ko
               ┗ 📂 en
               ┗ 📜 sample.html(❌ html 파일은 해당 폴더에 생성해야합니다. 파일이 있을경우 서버에러가 발생될 수 있습니다.)
```
  - src/@guide/page에서 html 파일을 다국어 맞춰 각각 생성해주세요
```bash 
    ex) 📂 @guide
         ┗ 📂 page
            ┗ 📜 page_ko.html
            ┗ 📜 page_en.html
```
  - src/@guide/page에서 생성한 html 안에 코드를 각각 수정해주세요. (✔ 표시부분)
```bash  
    {% set guideMenuIndex = 2 %}
    {% set guideTitle = "페이지 리스트" %}
    ✔{% set guideSubTitle = "국문" %}  ※ guideSubTitle은 추후 수정할 IA.json 이름과 동일해야 합니다.

    {% extends "@guide/index.html" %}
    {% block body %}
        {{ compNode | addGlobalVar('compNode') }}

        ✔{% for page in compNode.ko %} ※ compNode 뒤에 해당 언어 property 추가
            {% set totalLen = _.size( page.list )%}
            <h3 class="pat30">{{ page.name }}</h3>
            <div class="work-list">
```  
  - src/@guide/IA.json을 수정해주세요.
```bash 
   "guideGnb" : [
      {
         "link" : "/@guide/page/page_ko.html", ※ default url 변경
         "text" : "페이지 리스트"
      },
   ],

   "guideMenu" : {
      "menu2" : [ ※ src/@guide/page에서 생성한 html data 추가
         {
            "link" : "/@guide/page/page_ko.html",
            "text" : "국문",
            "iconClass" : "fas fa-list"
         },
         {
            "link" : "/@guide/page/page_en.html",
            "text" : "영문",
            "iconClass" : "fas fa-list"
         }
      ],
   }  
```

## Visual Studio Code 셋팅 방법 
  
> gulp 라이브러리를 global로 설치
```bash
npm install -g gulp

또는

yarn global add gulp

yarn 으로 설치시 아래와 같은 메시지와 함께 task 목록이 나타나지 않는경우 npm 으로 설치해주세요.
# Gulp Tasks: Command failed: gulp --tasks-simple --cwd 
```

> Visual Studio Code 에서 Gulp Tasks 플러그인 설치

왼쪽 화면에 Gulp Tasks 리스트 탭이 보이지 않는경우 Visual Studio Code를 종료 후 재시작 해주세요.
