/*
* 브라우저 체크
* callback:function
* params:parameter
* callback 없을시에 html에 해당 브라우저 class 추가
* */
PUB.MD.getBrowser = function( callback, params ){
	var agent = navigator.userAgent.toLowerCase(),
		name = navigator.appName,
		browser;

	// MS 계열 브라우저를 구분하기 위함.
	if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
		browser = 'ie';
		if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
			agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
			browser += parseInt(agent[1]);
		} else { // IE 11+
			if(agent.indexOf('trident') > -1) { // IE 11
				browser += 11;
			} else if(agent.indexOf('edge/') > -1) { // Edge
				browser = 'edge';
			}
		}
	} else if(agent.indexOf('safari') > -1) { // Chrome or Safari
		if(agent.indexOf('opr') > -1) { // Opera
			browser = 'opera';
		} else if(agent.indexOf('chrome') > -1) { // Chrome
			browser = 'chrome';
		} else { // Safari
			browser = 'safari';
		}
	} else if(agent.indexOf('firefox') > -1) { // Firefox
		browser = 'firefox';
	}

	// IE: ie7~ie11, Edge: edge, Chrome: chrome, Firefox: firefox, Safari: safari, Opera: opera
	//document.getElementsByTagName('html')[0].className = browser;
	if( typeof callback === 'function') {
		callback( params );
	} else {
		PUB.UI.elem.$html.addClass(browser);
	}
};

/**
 * 새창
 * @param href
 * @param name
 * @param option
 */
PUB.MD.openNewWindow = function( href, name, option ){
	if( PUB.VARS.IS_APP ){
		location.href = href;
	} else {
		window.open( href, name, option );
	}
};

/* VIEWPORT_WIDTH&HEIGHT */
PUB.MD.VIEWPORT = function(){
	if(PUB.UI.elem.$html.hasClass('safari')) {
		PUB.VARS.VIEWPORT_WIDTH = Math.max( PUB.UI.elem.$win.width() || 0);
	} else {
		PUB.VARS.VIEWPORT_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
	PUB.VARS.VIEWPORT_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};


/*
*
* PUB.VARS.IS_HAND_DEVICE : 단말기 기준 desktop인 경우 true
* PUB.VARS.IS_MOBILE : 단말기 기준 mobile인 경우 true;
* PUB.VARS.IS_TABLET : 단말기 기준 tablet인 경우 true;
* PUB.VARS.IS_VIEWTYPE : 해상도 기준으로 web, tablet, mobile 구분
*
* */
PUB.MD.CHK_DEVICE = function() {
	var mobileInfo = ['Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson'];
	$.each(mobileInfo, function(index){
		if (navigator.userAgent.match(mobileInfo[index]) !== null){
			PUB.VARS.IS_HAND_DEVICE = true;
			PUB.VARS.IS_MOBILE = true;
		}
	});

	if(PUB.VARS.VIEWPORT_WIDTH < PUB.VARS.IS_SIZE.MAXMOBILE && PUB.VARS.IS_HAND_DEVICE){
		PUB.VARS.IS_VIEWTYPE = 'mobile';
	} else if(PUB.VARS.VIEWPORT_WIDTH < PUB.VARS.IS_SIZE.MAXTABLET && PUB.VARS.IS_HAND_DEVICE){
		PUB.VARS.IS_VIEWTYPE = 'tablet';
	} else {
		if(PUB.VARS.VIEWPORT_WIDTH < PUB.VARS.IS_SIZE.MAXMOBILE ) {
			PUB.VARS.IS_VIEWTYPE = 'mobile';
		} else if (PUB.VARS.VIEWPORT_WIDTH < PUB.VARS.IS_SIZE.MAXTABLET ) {
			PUB.VARS.IS_VIEWTYPE = 'tablet';
		} else {
			PUB.VARS.IS_VIEWTYPE = 'web';
		}
	}

	/*if(PUB.VARS.VIEWPORT_WIDTH <= PUB.VARS.IS_SIZE.MAXMOBILE && PUB.VARS.IS_HAND_DEVICE){
		PUB.VARS.IS_VIEWTYPE = 'mobile';
	} else {
		if(PUB.VARS.VIEWPORT_WIDTH <= PUB.VARS.IS_SIZE.MAXMOBILE ) {
			PUB.VARS.IS_VIEWTYPE = 'mobile';
		} else {
			PUB.VARS.IS_VIEWTYPE = 'web';
		}
	}*/

	/* IS_TABLET check 추가 */

	if(PUB.VARS.VIEWPORT_WIDTH >= PUB.VARS.IS_SIZE.MAXMOBILE && PUB.VARS.IS_MOBILE) {
		PUB.VARS.IS_MOBILE = false;
		PUB.VARS.IS_TABLET = true;
	}

	PUB.VARS.IS_HAND_DEVICE ? $('html').addClass('handy') :$('html').addClass('no-handy');
};


/* CALLBACK DELAY FUNC */
PUB.MD.DELAY_FUNC = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();


/*
* $target 안 Focus First, last Element return
* return : Object type
* el_firstFocus : first Element
* el_lastFocus : last Element
* */
PUB.MD.FOCUSABLE = function( $target, justVisible ){
	var focusable = [];
	var focusableObj = {};
	focusableObj.el_firstFocus = null;
	focusableObj.el_lastFocus = null;

	$target.find('*').each(function(i, val) {
		if(val.tagName.match(/^A$|AREA|INPUT|TEXAREA|SELECT|BUTTON/gim) && parseInt(val.getAttribute("tabIndex")) !== -1 && ($(val).css('display') !== 'none') && ($(val).parent().css('display') !== 'none') ) {

			if( $(val).is(':disabled') ){
				return;
			}

			if( justVisible ){
				$(val).is(':visible') && focusable.push(val);
			} else {
				focusable.push(val);
			}
		}
		if((val.getAttribute("tabIndex") !== null) && (parseInt(val.getAttribute("tabIndex")) >= 0) && (val.getAttribute("tabIndex", 2) !== 32768) ) {
			if( justVisible ){
				$(val).is(':visible') && focusable.push(val);
			} else {
				focusable.push(val);
			}
		}
	});
	focusableObj.el_firstFocus = focusable[0];
	focusableObj.el_lastFocus = focusable[focusable.length-1];
	return focusableObj;
};


/*
*
* EventDispatcher
*
* */
PUB.MD.EventDispatcher = function(){
	var evtBus = [];

	this.addEventListener = function( $event, $listener ){
		if( typeof evtBus[ $event ] === 'undefined' ) evtBus[ $event ] = [];
		evtBus[ $event ].push( $listener );
		//console.log(evtBus)
	};

	this.removeEventListener = function( $event, $listener ){
		if( evtBus[ $event ] ){
			var len = evtBus[ $event ].length;
			for(var i = 0; i<len; i++){
				if( evtBus[ $event ][i] === $listener ){
					evtBus[ $event ].splice(i, 1);
					break;
				}
			}
		}
		//console.log(evtBus)

	};

	this.hasEventListener = function( $event ){
		return ( typeof evtBus[ $event ] === 'undefined' ) ? false : true;
	};

	this.dispatchEvent = function( $event, $data ){
		//console.log($data)
		var evt = (typeof $event === "string")? $event : $event.type;
		var sender = (typeof $event === "string") ? this : $event;
		if( typeof evtBus[ evt ] === 'undefined' ){
		} else {
			var len = evtBus[ evt ].length;
			for(var i = 0; i<len; i++){
				this.type = evt;
				if( $data ) this.data = $data;
				evtBus[ evt ][i]( sender );
			}
		}
		//console.log(evtBus)

	}
};


/*
*
* 상속
*
* */

PUB.MD.Extends = function ( inherit, parents ) {
	var base = inherit;
	inherit.prototype = new parents;
	inherit.prototype.constructor = base;
	// console.log("parents >>>" + parents)
	// console.log("inherit >>>" + inherit)
	// console.log("base >>>" + base)
	return inherit;
};


function IE8_Check(){
	var agent = navigator.userAgent.toLowerCase();
	var name = navigator.appName;
	var browser;
	if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
		browser = 'ie';
		agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
		//console.log(agent)
		browser += parseInt(agent[1]);
	}
	var ie8Status = ( browser === 'ie8' ) ? true : false;
	PUB.VARS.IS_IE8 = ie8Status;
}

PUB.MD.LABELPLACEHOLDER = function( $elem ){
	$elem.each(function(){
		var $this = $(this),
			$input = $this.find('input');
		$input.on({
			'focusin' : function(){
				$(this).siblings('span').addClass('screen--out');
			},
			'focusout' : function(){
				var str = $.trim($(this).val());
				if(!str){
					$(this).siblings('span').removeClass('screen--out');
				}
			}
		})
	});
};

// $('seletor').each(function(i){
// 	PUB.MD.aspectRatio( '6:4', 'width', 이미지컨테이너 );
// });

PUB.MD.aspectRatio = function( ratio, base, $obj ){
	var containerRatio = ratio.split(':');
	$obj.each(function(){
		var _this = $(this);
		if(base === 'width'){
			_this.css( 'height', Math.round((_this.outerWidth() / containerRatio[0]) * containerRatio[1]) );
		}else{
			_this.css( 'width', Math.round((_this.outerHeight() / containerRatio[1]) * containerRatio[0]) );
		}
	});
};

// $('seletor').each(function(i){
// 		이미지컨테이너.each(function(){
// 			var _this = $(this),
// 				_img = _this.find('img');
// 			PUB.MD.changeImageRatio( _this, _img );
// 		});
// 	});

PUB.MD.changeVideoRatio = function( $base, $obj ){
	var baseRatio = $base.outerWidth() / $base.outerHeight(),
		videoRatio = $obj.outerWidth() / $obj.outerHeight();
	// console.log($base.outerWidth(), $base.outerHeight())

	if($obj.get(0).videoWidth && $obj.get(0).videoHeight && $obj.get(0).duration){
		$obj.closest('.loading').removeClass('loading');
		videoSet( $obj );
	}else{
		$obj.on('loadeddata', function(e){
			var $this = $(this),
				setTime;
			$this.closest('.loading').removeClass('loading');
			// alert(this.clientWidth + ' : ' + this.videoWidth);
			if(this.videoWidth > 0){
				videoSet( $this );
			}else{
				setTime = setInterval(function(){
					if($this.get(0).videoWidth > 0){
						videoSet( $this );

						clearInterval(setTime);
					}

				},100);
			}
		});
	}

	function videoSet( $video ){
		$video.removeAttr('style');
		videoRatio = $video.get(0).videoWidth / $video.get(0).videoHeight;
		// console.log($video.get(0).videoWidth, $video.get(0).videoHeight);
		videoView();
	}

	function videoView(){
		if(videoRatio > baseRatio){
			$obj.css({
				'width' : 'auto',
				'height' : '100%',
				'position' : 'absolute',
				'left' : '50%',
				'transform':'translateX(-50%)'
			});
		}else{
			$obj.css({
				'width':'100%',
				'height':'auto',
				'position' : 'absolute',
				'top' : '50%',
				'transform':'translateY(-50%)'
			});
		}
		// if(videoRatio > 1){
		// }else{
		// }
	}
};

PUB.MD.changeImageRatio = function( $base, $image ){
	$base.css({'overflow' : 'hidden','position' : 'relative'});
	$image.css('position', 'absolute');

	if($image.prop('naturalWidth') === 0 || $image.prop('naturalHeight') === 0){
		imageLoad();
	}else{
		imgView();
	}

	function imageLoad(){
		$image.on('load', function(e){
			imgView();
		});
	}

	function imgView(){
		var baseRatio = $base.outerWidth() / $base.outerHeight(),
			imageRatio = $image.prop('naturalWidth') / $image.prop('naturalHeight');
		if(imageRatio > 1){
			if(imageRatio > baseRatio){
				$image.css({
					'width' : 'auto',
					'height' : '100%',
					'position' : 'absolute',
					'left' : '50%',
					'top' : 0,
					'transform':'translateX(-50%)'
				});
			}else{
				$image.css({
					'width':'100%',
					'height':'auto',
					'position' : 'absolute',
					'top' : '50%',
					'left' : 0,
					'transform':'translateY(-50%)'
				});
			}
		}else{
			$image.css({
				'width':'100%',
				'height':'auto',
				'position' : 'absolute',
				'top' : '50%',
				'left' : 0,
				'transform':'translateY(-50%)'
			});
		}
	}
};

PUB.MD.selectDateCheck = function(options) {
	var $container = options.container || $(document);
	var $default = {
		selectWrap: ".select__wrap",
		selectRow: ".row",
		selectVal: {
			year: null,
			month: null,
			day: null
		},
		oldLastDay: 31,
		lastDay: 31,
		startMinus: 20, //처음년도 올해년도 - startMinus
		endMinus: 0, //마지막 년도 올해년도 - endMinus
		selectYear: "[data-day-type=year] select",
		selectMonth: "[data-day-type=month] select",
		selectDay: "[data-day-type=day] select"
	};
	var options = $.extend({}, $default, options);
	var $year = $container.find(options.selectYear);
	var $month = $container.find(options.selectMonth);
	var $day = $container.find(options.selectDay);
	function pad(n, width) {
		n = n + "";
		return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
	}
	function optionDomMake(arr) {
		var dom = "";
		dom += '<option value="' + arr["option"].value + '">' + arr["option"].text + "</option>\n";
		return dom;
	}
	function ajaxOptions(elm, arr) {
		var $this = elm;
		var defaultOptionText = $this.find("option").eq(0).text();
		var optionDom = "";
		optionDom += '<option value="">' + defaultOptionText + "</option>\n";
		/*
        *
        * optgroup = {
        *   label : label name
        *   list : {
        *       option : {
        *           value : "value"
        *           text : "text"
        *       }
        *   }
        * }
        *
        *
        * */
		for (var i = 0, len = arr.length; i < len; i++) {
			var groupName = Object.keys(arr[i]).toString();
			switch (groupName) {
				case "optgroup":
					optionDom += '<optgroup label="' + arr[i]["optgroup"].label + '">\n';
					for (var j = 0, max = arr[i]["optgroup"].list.length; j < max; j++) {
						optionDom += optionDomMake(arr[i]["optgroup"].list[j]);
					}
					optionDom += "</optgroup>\n";
					break;

				default:
					optionDom += optionDomMake(arr[i]);
					break;
			}
		}
		$this.html(optionDom);
		$this.trigger("update", true);
	}
	function yearSetting() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		//January is 0!
		var yyyy = today.getFullYear();
		var startYear = yyyy - options.startMinus;
		var endYear = yyyy - options.endMinus;
		var yearOption = [];
		var j = 0;
		for (var i = endYear; i >= startYear; i--) {
			yearOption[j] = {
				option: {
					value: i,
					text: i
				}
			};
			j++;
		}
		ajaxOptions($year, yearOption);
	}
	function daySetting(event) {
		var $this = $(this);
		var updateDay = [];
		var selectDayType = $this.closest(options.selectWrap).data("dayType");
		options.selectVal[selectDayType] = $this.val();
		if (options.selectVal.year !== null && options.selectVal.month !== null) {
			options.lastDay = new Date(options.selectVal.year, options.selectVal.month, 0).getDate();
			if (options.lastDay !== options.oldLastDay) {
				for (var i = 0; i < options.lastDay; i++) {
					updateDay[i] = {
						option: {
							value: pad(i + 1, 2),
							text: pad(i + 1, 2)
						}
					};
				}
				ajaxOptions($this.closest(options.selectRow).find(options.selectDay), updateDay);
			}
			options.oldLastDay = options.lastDay;
		}
	}
	function init() {
		if ($year.length > 0) {
			yearSetting();
		}
		$year.add($month).on("change", daySetting);
	}
	init();
};

PUB.MD.focusWithOutScroll = function(target, isTargetFocus, callback){
	var $html = $('html'),
		$body = $('body'),
		_htmlY = parseInt($html.scrollTop(),10),
		_bodyY = parseInt($body.scrollTop(),10),
		$hasScrollElem,
		_posY;

	if( _htmlY !== 0 ){
		$hasScrollElem = $html;
		_posY = _htmlY;
	} else {
		$hasScrollElem = $body;
		_posY = _bodyY;
	}
	if(isTargetFocus) {
		target.focus();
	}
	$hasScrollElem.scrollTop(_posY);
	callback && callback();
};


/***
 * cookie Warpper
 * support object value
 */
PUB.MD.cookie = (function(){

	function set(name, value, seconds) {

		if(typeof value === 'object'){
			value = JSON.stringify(value);
		}

		var date = new Date();
		var expires = '; expires=';

		if(typeof seconds !== 'undefined'){
			date.setTime(date.getTime() + (seconds * 1000));
			expires += date.toGMTString();
		} else {
			expires = '';
		}
		document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
	}

	function get(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
			try {
				if (c.indexOf(nameEQ) === 0) {
					var v = decodeURIComponent(c.substring(nameEQ.length, c.length));
					return JSON.parse(v);
				}
			} catch (e) {
				return v;
			}
		}
		return null;
	}

	function clear(name) {
		set(name, '', -1);
	}

	function hset(name, key, value) {
		var obj = get(name);
		obj = obj || {};
		obj[key] = value;
		set(name, obj, 30);
	}

	function hget(name, key) {
		var obj = get(name);
		return (obj && obj[key]) || null;
	}

	function hclear(name, key) {
		var obj = get(name);
		delete obj[key];
		set(name, obj, 30);
	}

	return {
		get: get,
		set: set,
		clear: clear,
		hget: hget,
		hset: hset,
		hclear: hclear
	};

})();

/***
 * storage Warpper
 * window.localstorage,
 * window.sessionstorage
 * var ls = PUB.MD.storageFactory(window.localStorage);
 * var ss = PUB.MD.storageFactory(window.sessionStorage);
 * support object value
 */
PUB.MD.storageFactory = function ( storage ) {
	var inMemoryStorage = {};

	function isSupported() {
		try {
			var key = "__IS_SUPPORTED_TEST";
			storage.setItem(key, key);
			storage.removeItem(key);
			return true;
		} catch (e) {
			return false;
		}
	}

	function getItem(key) {
		if (isSupported()) {
			return JSON.parse(storage.getItem(key));
		}
		return inMemoryStorage[key] || null;
	}

	function setItem(key, value) {
		if (isSupported()) {
			storage.setItem(key, JSON.stringify(value));
		} else {
			inMemoryStorage[key] = value;
		}
	}

	function removeItem(key) {
		if (isSupported()) {
			storage.removeItem(key);
		} else {
			delete inMemoryStorage[key];
		}
	}

	function clear() {
		if (isSupported()) {
			storage.clear();
		} else {
			inMemoryStorage = {};
		}
	}

	function key(n) {
		if (isSupported()) {
			return storage.key(n);
		} else {
			return Object.keys(inMemoryStorage)[n] || null;
		}
	}

	return {
		getItem : getItem,
		setItem : setItem,
		removeItem : removeItem,
		clear : clear,
		key : key
	};
};

PUB.MD.cache = (function(){
	// TODO : 앱에서 사용가능한 캐시 확인 후 작업

	var IS_APP = false;

	var name = (function(){
		return IS_APP ? 'storage' : 'cookie';
	})();

	function get( key ){

	}

	function set(){

	}

	function remove(){

	}

	function clear(){

	}

	return {
		name : name,
		set : set,
		get : get,
		remove : remove,
		clear : clear
	}
})();

PUB.MD.inView = function( obj ){
	var $element = obj,
		elementSize   = { height: $element[0].offsetHeight, width: $element[0].offsetWidth },
		elementOffset = $element.offset(),
		viewportOffset, viewportSize, inView;

	function getViewportOffset() {
		return {
			top:  window.pageYOffset || document.documentElement.scrollTop   || document.body.scrollTop,
			left: window.pageXOffset || document.documentElement.scrollLeft  || document.body.scrollLeft
		};
	}

	function getViewportSize() {
		var mode, domObject, size = { height: window.innerHeight, width: window.innerWidth };

		// if this is correct then return it. iPad has compat Mode, so will
		// go into check clientHeight/clientWidth (which has the wrong value).
		if (!size.height) {
			mode = document.compatMode;
			if (mode || !$.support.boxModel) { // IE, Gecko
				domObject = mode === 'CSS1Compat' ?
					document.documentElement : // Standards
					document.body; // Quirks
				size = {
					height: domObject.clientHeight,
					width:  domObject.clientWidth
				};
			}
		}
		return size;
	}

	viewportOffset = viewportOffset || getViewportOffset();
	viewportSize   = viewportSize   || getViewportSize();


	if (elementOffset.top + elementSize.height > viewportOffset.top &&
		elementOffset.top < viewportOffset.top + viewportSize.height &&
		elementOffset.left + elementSize.width > viewportOffset.left &&
		elementOffset.left < viewportOffset.left + viewportSize.width) {
		inView = true;
	} else {
		inView = false;
	}

	return inView;
};