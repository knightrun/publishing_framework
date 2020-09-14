* PUB.MD.getBrowser( callback, params );  
    - 브라우저 체크
    
* PUB.MD.openNewWindow( href, name, option );
    - APP에서는 location을 변경, 그외에는 window.open동작 
    
* PUB.MD.popup();  
    - PUB.MD.popup().bind( a Tag object );  
    - 사용 data 어트리뷰트  
        - width, height, x, y, name 
        
                
* PUB.MD.DELAY_FUNC( cb, ms );  
    * _.debounce 와 동일
    

* PUB.MD.FOCUSABLE( $target, justVisible );
    - $target 은 jquery wrapper element
    - justVisible 옵션은 visible 상태인 focus 엘리먼트만 리턴여부
    
    
* PUB.MD.LABELPLACEHOLDER( $eleArray );  

* PUB.MD.aspectRatio( ratio=[16:9], base=[width,height], $obj );  
    * $obj의 base를 기준으로 높이든 너비든 비율대로 지정

    
* PUB.MD.changeImageRatio( $base, $image );
    * $base에 $image 위치 조정


* PUB.MD.storeMaker
    * d005 룸리스트와 n001비교하기 간의 데이터 공유

* PUB.MD.focusWithOutScroll(target, isTargetFocus, callback)
    * scroll 이동없이 target에 포커스 이동 
    
    
* PUB.MD.cookie 쿠키오브젝트

* PUB.MD.storageFactor [미사용]
    * local/session Storage wrapper 