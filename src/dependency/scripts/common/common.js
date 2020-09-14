(function($){
	/* ready 전 */
	var OLD_VIEWTYPE = null;
	PUB.UI.elem.$doc = $(document);
	PUB.UI.elem.$win = $(window);
	PUB.UI.elem.$html = $('html');
	PUB.UI.elem.$body = $('body');
	PUB.UI.elem.head = document.getElementsByTagName("head")[0];
	PUB.MD.VIEWPORT();
	PUB.MD.CHK_DEVICE();

	function commonResizeInit() {
		PUB.MD.VIEWPORT();
		PUB.MD.CHK_DEVICE();
		//responsiveClass();
		if( PUB.VARS.IS_VIEWTYPE.toLowerCase() !== OLD_VIEWTYPE ){
			PUB.UI.elem.$win.trigger('mq',[OLD_VIEWTYPE,PUB.VARS.IS_VIEWTYPE] );
			OLD_VIEWTYPE = PUB.VARS.IS_VIEWTYPE.toLowerCase();
		}
	}

	function mqCallback(e, oldViewType, newViewType) {
		if (oldViewType !== newViewType) {
		}
	}

	function commonInit(){
		commonResizeInit();
		PUB.UI.elem.$win.on('resize', commonResizeInit);
		PUB.UI.elem.$win.on("mq", mqCallback);
	}

	$(function(){
		commonInit();
	});
})(jQuery);
