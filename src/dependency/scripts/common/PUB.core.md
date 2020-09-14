# core.js

- PUB.UI
- PUB.UI.Components (function)
- PUB.UI.LIBS (object)
- PUB.UI.keys (object)
- PUB.UI.elem (object:dom) 엘리먼트 캐싱  
    .$doc  
    .$win  
    .$html  
    .$body  
    .$head    
    
- PUB.UI.events (object)  이벤트명 상수처리 

- PUB.UI.log('메시지','컬러값');   
    * console.log 랩핑  
    
- PUB.UI.debug('메시지');
    * mobile 단말에서 우상단에 로그 찍힘
    

- PUB.UI.transitionEndName  
    * CSS TransitionEnd 이벤트 명   
    
- PUB.UI.animationEndName  
    * CSS animationEnd 이벤트 명 
    
- PUB.UI.getScrollTop() 
    - 윈도우 스크롤 Top 리턴
    
- PUB.UI.getScrollWidth()
    - 해당 브라우저의 ScrollBar의 width 값 리턴.
    
- PUB.UI.scrollLock( setToLock, activeCallback, inactiveCallback )
    - setToLock : true / false
    
- PUB.UI.layer
    - 안드로이드 뒤로가기물리키를 위한 layer관리

- PUB.UI.dim( method, withAnimation, callback );
    - scrollLock과 dim는 Modal과 loading에서 사용됨
    
    
    