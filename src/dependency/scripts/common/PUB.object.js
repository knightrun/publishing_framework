var PUB = PUB || {};                                                // NAMESPACE 지정
PUB.VARS = PUB.VARS || {};                                          // 공통 변수 OBJECT
PUB.VARS.LANG = ( PUB.LANGUAGE && PUB.LANGUAGE.toLowerCase() ) || $('html').attr('lang').toLowerCase();
PUB.VARS.VIEWPORT_WIDTH = null;                                     // WIDTH
PUB.VARS.VIEWPORT_HEIGHT = null;                                    // HEIGHT
PUB.VARS.IS_AUTHOR = false;                                         // AUTHOR mode check
PUB.VARS.IS_PREVIEW = false;                                        // PREVIEW mode check
PUB.VARS.IS_HAND_DEVICE = false;                                    // 핸드 드바이스 체크 변수
PUB.VARS.IS_MOBILE = false;                                         // 디바이스 모바일 변수
PUB.VARS.IS_TABLET = false;                                         // 디바이스 테블릿 변수
PUB.VARS.IS_IE8 = ( $('html').hasClass('ie8') ) ? true : false;     // IE8 체크
PUB.VARS.IS_SIZE = PUB.VARS.IS_SIZE || {};                          // 반응형시 SIZE OBJECT
PUB.VARS.IS_SIZE.MAXMOBILE = 721;                                   // 반응형시 MOBILE 최대값
PUB.VARS.IS_SIZE.MAXTABLET = 1023;                                  // 반응형시 TABLET 최대값
PUB.VARS.IS_HTML = ( window.is_html === false ) ? false : true;     // 퍼블리싱 코드
PUB.VARS.USERAGENT = navigator.userAgent.toLowerCase();
PUB.VARS.IS_APP = PUB.VARS.USERAGENT.indexOf('project') !== -1;  // 앱에서 접속
PUB.VARS.IS_APP_ANDROID = PUB.VARS.IS_APP && PUB.VARS.USERAGENT.indexOf('android') !== -1;
PUB.VARS.IS_APP_IOS = PUB.VARS.IS_APP && PUB.VARS.USERAGENT.indexOf('iphone') !== -1;
PUB.VARS.IS_ANDROID = PUB.VARS.USERAGENT.indexOf('android') !== -1;
PUB.VARS.IS_ANDROID_NAVER_APP = PUB.VARS.IS_ANDROID && PUB.VARS.USERAGENT.indexOf('naver(inapp') !== -1; // naver app
PUB.VARS.IS_SAMSUNG_BROWSER = PUB.VARS.USERAGENT.indexOf('samsungbrowser') !== -1;
//PUB.VARS.BREAKPOINT = 960;
// alert(PUB.VARS.IS_ANDROID_NAVER_APP);
PUB.MD = PUB.MD || {};                                              // 공통 모듈
PUB.MD.DEV = PUB.MD.DEV || {};                                      // 개발자용 공통 모듈
PUB.UI = PUB.UI || {};