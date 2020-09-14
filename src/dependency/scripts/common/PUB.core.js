(function($){

    var readyCallback = [];
    var appendList = [];
    var loadCount = 0;
    var loadCompletCount = 0;

    function parser( value ){

        var src = String(value);
        var srcFile = src.match(/\[(.*?)\]/g);
        //console.log(value)
        //console.log(srcFile)
        //console.log(srcFile[0])
        src = src.replace(srcFile[0], '');
        srcFile = srcFile[0].replace(/\[/g,'');
        srcFile = srcFile.replace(/\]/g,'');
        src = src.replace(/\./g, '/') + srcFile + '.js';
        return PUB.DEPENDENCYPATH + src;
    }

    function scriptElement ( src ){
        var script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.type = "text/javascript";
        script.charset = "utf-8";
        return script;
    }

    function loadJs( value, callback ){
        var script = scriptElement( parser(value) );

        script.onerror = function(e){
            e.msg = value + " load error";
            (console.error || console.log).call(console, e.msg || e);

        };

        if(script.readyState){ // 인터넷 익스플로러
            script.onreadystatechange = function(){
                if(script.readyState==="loaded" || script.readyState==="complete"){
                    script.onreadystatechange = null;
                    if( typeof callback === 'function'  && callback !== undefined ) {
                        PUB.UI.keys[ value ] = "complete";
                        callback( [value] );
                    }
                }
            };
        } else {  // 다른  브라우저
            script.onload = function(){
                if( typeof callback === 'function'  && callback !== undefined ) {
                    PUB.UI.keys[ value ] = "complete";
                    callback( [value] );
                }
            };
        }

        if( appendList.indexOf( value ) > -1) return;
        PUB.UI.elem.head.appendChild(script);
        loadCompletCount++;
        appendList.push(value);
    }

    function libsCheck( libs ) {
        //console.dir(libs)
        //console.log(libs)
        var len = libs.length;
        for(var i = 0;len > i; i++) {
            if( !PUB.UI.keys[libs[i]] ) {
                PUB.UI.keys[libs[i]] = "loading";
                loadJs( libs[i], libsCheck );
                //console.log(PUB.UI.keys[libs[i]])
                //len = appendList.length-1;
            } else {
                if(PUB.UI.keys[libs[i]] === "loading" ) {
                    loadJs( libs[i], libsCheck );
                    //console.log(PUB.UI.keys[libs[i]])
                    //len = appendList.length-1;
                } else {
                    //console.log("loadCount load >>> " + loadCount)
                    loadCount++;
                    //console.log(loadCount)
                    //console.log(PUB.UI.keys[libs[i]])
                    compCoreInit( deleteReady );
                }
            }

        }
    }

    function comploadCheck( fn ){
        var status = false;
        var statusNum = 0;
        //if(!fn.libs) return;
        //console.log(fn)
        var len = fn.libs.length;
        //console.log(PUB.UI.keys)
        for(var i = 0; i < len; i++) {
            //try {
            if (PUB.UI.keys[fn.libs[i]] === 'complete') {
                statusNum++;
            }
            //} catch(e) {
            //    console.log(PUB.UI.keys)
            // }
        }

        if( statusNum === len ) {
            status = true;
        }

        //console.log(status)

        return status;
    }

    function deleteReady( fn ){

        delete PUB.UI.keys[fn.libs];
        //console.log(PUB.UI.keys)
        for(var key in PUB.UI.LIBS) {
            //console.log(key)
            delete PUB.UI.LIBS[key].codename;
            delete PUB.UI.dependency;
            delete PUB.UI.loadCheck;
            delete PUB.UI.loadLibs;
            delete readyCallback;
            //console.log(readyCallback)
            //console.dir(readyCallback)
            if( PUB.UI.LIBS[key].dependency ) {
                delete PUB.UI.LIBS[key].dependency;
            }
        }
    }

    function compCoreInit( cb ) {
        if( loadCount === loadCompletCount ) {
            var callbackfn;
            for (var i = 0, len = readyCallback.length; len > i; i++) {
                var loadStatus = comploadCheck( readyCallback[i] );
                if (loadStatus) {
                    readyCallback[i]();
                    callbackfn= readyCallback[i];
                    try {
                        //readyCallback[i]();
                        //delete readyCallback[i].libs;
                        //delete readyCallback[i];
                    }
                    catch(e) {
                        console.log("%c <<<<<< " + readyCallback[i].name + " error sta//t >>>>>>", 'color: red; font-weight:bold');
                        (console.error || console.log).call(console, e.stack || e);
                        console.log("%c <<<<<< " + readyCallback[i].name + " error end >>>>>>", 'color: red; font-weight:bold');
                    }
                    //console.log("delete")

                    cb( callbackfn );

                } else {
                    for(var key in PUB.UI.keys) {
                        if(PUB.UI.keys[key] === 'loading') {
                            loadCount =  loadCount - 1;
                            libsCheck([key])
                        }
                    }
                }
            }

        }
    }


    PUB.UI = {
        Components : function(){},
        LIBS : {},
        keys : {},
        elem : {
            $doc : $(document),
            $win : $(window),
            $html : $('html'),
            $body : $('body'),
            head : document.getElementsByTagName("head")[0]
        },
        events : {
            resize : "resize",
            ready : "ready",
            load : "load",
            click : "click",
            mousewheel : "DOMMouseScroll mousewheel wheel",
            mousemove : "mousemove",
            mousedown : "mousedown",
            mouseup : "mouseup",
            touchstart : "touchstart",
            touchmove : "touchmove",
            touchend : "touchend",
            scrolllock: "scrolllock",
            scrollunlock: "scrollunlock"
        },
        keycode : {
            tab 		: 9,
            enter 		: 13,
            up 			: 38,
            down 		: 40,
            left 		: 37,
            right 		: 39,
            esc 		: 27,
            backspace 	: 8,
            space	 	: 32
        },

        dependency : function( fn ){
            var dependency = fn.dependency;
            if ( dependency ) {
                for(var i= 0, len = readyCallback.length; i < len; i++ ) {
                    //console.dir("readyCallback >>> " + readyCallback[i].libs)
                    //console.dir("readyCallback >>> " + fn.codename)
                    if(readyCallback[i].libs.indexOf( fn.codename ) > -1) {
                        readyCallback[i].libs = readyCallback[i].libs.concat( dependency );
                    }
                }
            }
            libsCheck( fn.dependency );
        },

        loadLibs : function( libs, callback ){
            //console.log(libs)
            if( typeof callback === 'function' && callback !== undefined ) {
                callback.libs = libs.reverse();
                readyCallback.push( callback );
            }
            //console.dir(libs)
            libsCheck( libs );
        },

        loadCheck : function( fn ){
            var jscode = fn.codename;
            PUB.UI.keys[ jscode ] = "complete";
        },

        log : function( msg, color ){
            if( msg ){
                color || (color = 'red');
                PUB.VARS.IS_HTML && window.console.log("%c [DEBUG] " + msg, "color:"+color+";");
            }
        },

        debug : function( msg ){
            if( !PUB.VARS.IS_HTML ){
                return;
            }
            if( msg ){
                var $html = '<div id="debug" style="position:fixed;top:0;right:0;z-index:9999;background-color:#000;color:#fff;font-size:14px;"></div>';
                if( !$('#debug').length ){
                    $('body').append( $html );
                }
                $('#debug').text( msg );
            }
        },

        transitionEndName : (function(){
            var keys,
                el = document.createElement('fakeelement'),
                transitions = {
                    'transition':'transitionend',
                    'OTransition':'oTransitionEnd',
                    'MozTransition':'transitionend',
                    'WebkitTransition':'webkitTransitionEnd'
                };

            for( keys in transitions ){
                if( el.style[keys] !== undefined ){
                    return transitions[keys];
                }
            }
        }()),


        animationEndName : (function(){
            var keys,
                el = document.createElement('fakeelement'),
                animations = {
                    'animation':'animationend',
                    'OAnimation':'oAnimationEnd',
                    'MozAnimation':'animationend',
                    'WebkitAnimation':'webkitAnimationEnd'
                };

            for( keys in animations ){
                if( el.style[keys] !== undefined ){
                    return animations[keys];
                }
            }
        }()),

        getScrollTop : (function(){
            var $wrapper;
            return function(){
                $wrapper = $wrapper || $(window);
                return $wrapper.scrollTop();
            }
        })(),

        getScrollWidth : (function(){
            var _width;
            var _get = function(){
                var outer = document.createElement("div");
                outer.style.visibility = "hidden";
                outer.style.width = "100px";
                outer.style.msOverflowStyle = "scrollbar";

                document.body.appendChild(outer);

                var widthNoScroll = outer.offsetWidth;
                outer.style.overflow = "scroll";

                var inner = document.createElement("div");
                inner.style.width = "100%";
                outer.appendChild(inner);

                var widthWithScroll = inner.offsetWidth;

                outer.parentNode.removeChild(outer);
                return widthNoScroll - widthWithScroll;
            };

            return function() {
                return _width = _width ? _width : _get();
            }
        })(),

        scrollLock : (function(){

            var activeClassName = 'has-modal';
            var $win, $html, $body, isActive;

            return function( setToLock, activeCallback, inactiveCallback){
                $win = $win || $(window);
                $html = $html || $('html');
                $body = $body || $('body');

                if( setToLock ){
                    if( isActive ){
                        return 'active';
                    } else {
                        _active();
                    }
                } else {
                    if( isActive ){
                        _inactive( inactiveCallback );
                    } else {
                        return 'inactive';
                    }
                }

                return isActive;
            };

            function _active(){
                var scrollTop = PUB.UI.getScrollTop();
                //PUB.UI.debug('PUB.UI.getScrollTop() : _active '+ scrollTop );
                var scrollbarWidth = ( PUB.VARS.VIEWPORT_HEIGHT < $body.height() ) ? PUB.UI.getScrollWidth() : 0;
                $body.data('scrollTop',scrollTop)
                    // .css({
                    //     'marginTop' : '-'+scrollTop+'px',
                    //     'paddingRight' : scrollbarWidth
                    // });
                    .css({
                        'marginTop' : '-'+scrollTop+'px'
                    });
                $html.addClass( activeClassName );
                $win.trigger(PUB.UI.events.scrolllock);
                isActive = true;
            }

            function _inactive( callback ){
                var scrollTop = $body.data('scrollTop');
                //PUB.UI.debug('PUB.UI.getScrollTop() : _inactive '+ scrollTop );

                $body.css({
                    'marginTop' : 0,
                    'paddingRight' : 0
                }).removeData('scrollTop');
                $html.removeClass( activeClassName );
                $win.scrollTop( scrollTop ).trigger(PUB.UI.events.scrollunlock);

                if( typeof callback === 'function' ){
                    callback();
                }

                isActive = false;
            }
        })(),

        layer : (function(){
            var basket = [],
                defaultZindex = 100,
                topZindex = defaultZindex;

            return {
                push : function( layerObj ){
                    var exits;

                    $.each( basket, function(index, item){
                        if( item.id === layerObj.modalID ){
                            exits = true;
                        }
                    });

                    if( !exits ){
                        basket.push({
                            id : layerObj.modalID,
                            layer : layerObj
                        });
                        layerObj.zindex = topZindex+10;

                        layerObj.$modal.css('zIndex', layerObj.zindex );
                        topZindex = layerObj.zindex;
                    }
                },
                pop : function( modalID ){

                    var filtered = basket.filter(function(item,index){
                        return (item.id !== modalID);
                    });

                    if( filtered.length ){
                        basket = filtered;
                        topZindex = basket[basket.length -1].layer.$modal.css('zIndex');
                    } else {
                        basket = [];
                        topZindex = defaultZindex;
                    }
                },
                all : function(){
                    return basket;
                },
                current : function(){
                    return basket[basket.length -1] && basket[basket.length -1].layer;
                },
                usedDim : function(){
                    var used = [];

                    $.each( basket, function(index,item){
                        if( item.layer.usedDim ){
                            used.push( index );
                        }
                    });

                    return used.length;
                },
                getZindex : function(){
                    return topZindex;
                },
                close : function(){
                    if( basket.length ) {
                        var target = basket[basket.length - 1];
                        target.layer.$modal.trigger('close');
                        return true;
                    } else {
                        return false;
                    }
                },
                closeAll : function(){
                    if( basket.length ) {
                        _.each(basket.slice().reverse(),function(modal){
                            modal.layer.close();
                        });
                    }
                }
            }
        })(),

        dim : (function(){

            var $html, $body, $dim,
                isMoving = false,
                dimedClass = 'o-dimed',
                transitionEndName;

            function _move(){

                $dim.removeClass('is-active').css('zIndex',PUB.UI.layer.getZindex()-1).addClass('is-active');

            }

            function _on( withAnimation, callback ){

                var isNewDim = false;

                if( !$dim ){
                    isNewDim = true;
                    $('<div class="'+dimedClass+'" aria-hidden="true"></div>').prependTo($body);
                    $dim = $body.find( '.'+dimedClass );
                }

                if( !isNewDim ){

                    _move();

                } else {

                    if( withAnimation && !isMoving ){
                        isMoving = true;
                        $dim.addClass(dimedClass+'--transition').one( transitionEndName, function(){
                            isMoving = false;
                            (typeof callback === 'function') && callback();
                        });
                        $dim.get(0).getBoundingClientRect();
                        $dim.addClass('is-active');
                        PUB.UI.scrollLock( true );
                        PUB.UI.transitionEndName || $dim.trigger(transitionEndName);

                    } else {
                        PUB.UI.scrollLock( true );
                        $dim.addClass('is-active');
                        (typeof callback === 'function') && callback();
                    }

                }
            }

            function _off( withAnimation, callback ){

                if( $dim ){

                    if( PUB.UI.layer.usedDim() ){
                        _move();
                        (typeof callback === 'function') && callback();
                        return false;
                    } else {

                        if( withAnimation && !isMoving ){
                            isMoving = true;
                            $dim.one( transitionEndName, function(){
                                isMoving = false;
                                $dim.remove();
                                $dim = null;
                                (typeof callback === 'function') && callback();
                            }).removeClass('is-active');

                            PUB.UI.scrollLock(false);
                            PUB.UI.transitionEndName || $dim.trigger(transitionEndName);
                        } else {

                            $dim.remove();
                            $dim = null;
                            PUB.UI.scrollLock(false);
                            (typeof callback === 'function') && callback();

                        }

                    }

                }

            }

            return function( method, withAnimation, callback ){
                $html = $html || $('html');
                $body = $body || $('body');

                transitionEndName = PUB.UI.transitionEndName || 'transitionEndFallback';

                if( method === 'get' ){
                    return $dim;
                } else {
                    method ? _on( withAnimation, callback ) : _off( withAnimation, callback );
                }
            }
        })(),

        loading : function( target, method, callback ){

            var loading = $('.loading-dimmd');
            var loadingData = 'loadingOptions';

            loading.each(function() {
                var $this = $(this);
                if ($this.data( loadingData ) === undefined) {
                    $this.data( loadingData, $.extend({
                        loading : $this,
                        loadingBar : $this.find('[data-js=loading]'),
                        loadingCheck : false,
                        speed : 0.6
                    }, $this.data()));
                }
            });

            function loadingOn( target, callback ) {
                var options = $(target).data( loadingData );
                if ( !options.loadingCheck ) {
                    options.loading.show();
	                options.loadingCheck = true;
                    //loadingAnimation( options );
                }
                (typeof callback === 'function') && callback();
            }

            function loadingOff( target, callback ) {

                var options = $(target).data( loadingData );
                if ( options.loadingCheck ) {
                    //clearInterval( options.loadingCheck );
                    options.loadingCheck = false;
                    options.loadingBar.removeAttr('style');
                    options.loading.hide();
                }
                (typeof callback === 'function') && callback();

            }

	        /*function loadingAnimation( obj ) {
				obj.loadingCheck = true;
				var degree = 0;
				obj.loadingCheck = setInterval(function(){
					if (degree == 360) {
						degree = 0;
					}
					obj.loadingBar.css({
						'-webkit-transform': 'rotate(' + degree + 'deg)',
						'-moz-transform': 'rotate(' + degree + 'deg)',
						'-ms-transform': 'rotate(' + degree + 'deg)',
						'-o-transform': 'rotate(' + degree + 'deg)',
						'transform': 'rotate(' + degree + 'deg)'
					});
					degree++
				}, obj.speed );

            }*/

            if( PUB.VARS.IS_APP ){
                return;
            }

            if( method === 'get' ){
                return target.data( loadingData );
            } else {
                method ? loadingOn( target, callback ) : loadingOff( target, callback );
            }
        },

        domobserver : (function(){
            var observer = null;
            return {
                obscont : function( target, cb ){
                    var debounceCheckLoad = _.debounce(cb,125);
                    if(window.MutationObserver){
                        //PUB.UI.debug('MutationObserver');
                        observer = new MutationObserver(function(mutations){
                            for (var i=0; i < mutations.length; i++){
                                for (var j=0; j < mutations[i].addedNodes.length; j++){
                                    debounceCheckLoad(mutations[i]);
                                }
                            }
                        });
                        observer.observe( target , {childList: true,subtree :true} );
                    } else {
                        PUB.UI.elem.$body.on('DOMNodeInserted', debounceCheckLoad );
                    }
                },
                obsdiscont : function(){
                    if( observer ) {
                        observer.disconnect();
                    }
                }

            }

        })()

    };


})(jQuery);


