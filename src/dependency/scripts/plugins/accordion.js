/**
 *  아코디언
 *  $(element).accordion();
 */
;(function($, window, document, undefined) {
	var pluginName = 'accordion';

	$.fn[pluginName] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});

		return this;
	};

	$.fn[pluginName].defaults = {
		event : 'click',    // 'mouseenter focusin'
		speed : 0.3,
		container : '[data-js="accordion"]',
		anchorEl : '[data-js="accordion__anchor"]',
		panelEl : '[data-js="accordion__panel"]',
		activeClassName : 'is-active',
		openComplateClassName : 'is-opened',
		disabledClassName : 'is-disabled',
		multi : false,
		scrollTop : false,
		onLoadAccordion : null,
		onCompleteAccordion : null,
		onDestroyAccordion : null
	};

	function Plugin ( element, options ) {
		this.element = element;
		this.$element = $(this.element);
		this._name = pluginName;
		this._defaults = $.fn[pluginName].defaults;
		this._defaults.container = (this.$element.attr('data-js') !== 'accordion') ? '[data-js="'+ this.$element.attr('data-js') +'"]' :  this._defaults.container;
		this._defaults.multi = this.$element.data('multi') || false;
		this.options = $.extend( {}, this._defaults, options, $(this.element).data() );
		this.init();
	}

	$.extend( Plugin.prototype, {

		init : function () {
			var plugin = this;
			plugin.bindEvents();
			plugin.buildCache();
			(plugin.options.onLoadAccordion !== null) && plugin.onLoadAccordion();
		},

		destroy : function(){
			var plugin = this;
			plugin.$anchor.removeAttr('style aria-controls aria-expanded').removeClass( plugin.options.activeClassName );
			plugin.$panel.removeAttr('style').removeClass( plugin.options.activeClassName );
			plugin.$anchor.add(plugin.$wrap).off('.' + plugin._name);
			(plugin.options.onDestroyAccordion !== null) && plugin.onDestroyAccordion();
			plugin.$element.removeData("plugin_" + pluginName);
		},

		buildCache : function(){
			var plugin = this;
			var accordionId = [];

			plugin.$anchor.each(function(index){
				var $this = $(this);
				var _id = $this.attr('id') ? $this.attr('id') : _.uniqueId('js-unique-');
				var $status = $this.find('[data-js=status_text]');
				$this
					.data( plugin._name+'_target', plugin.$panel.eq(index) )
					.data( 'index' , index )
					.attr({
						'aria-controls' : _id,
						'role' : 'accordion anchor',
						'aria-expanded' : $this.hasClass( plugin.options.activeClassName ) ? true : false
					});

				if($this.hasClass( plugin.options.activeClassName )){
					$status.text('close');
				}else{
					$status.text('open');
				}

				accordionId.push( _id );
			});

			plugin.$panel.each(function(index){
				$(this).attr({
					'id' : accordionId[index],
					'aria-labelledby' : accordionId[index],
					'role' : 'accordion panel'
				});
			});

		},

		bindEvents : function(){
			var plugin = this;

			plugin.$wrap = $(plugin.element);
			plugin.$anchor = plugin.$wrap.find( plugin.options.anchorEl).not(function(){
				return $(this).closest(plugin.options.container).get(0) !== plugin.$wrap.get(0);
			});
			plugin.$panel = plugin.$wrap.find( plugin.options.panelEl).not(function(){
				return $(this).closest(plugin.options.container).get(0) !== plugin.$wrap.get(0);
			});

			plugin.$anchor.on(plugin.options.event + '.' + pluginName, function(e){
				e.stopPropagation();
				e.preventDefault();
				plugin.tween(e);
			});
		},

        tween : function( event ) {
			var plugin = this;
			var _this = $(event.currentTarget),
				idx = plugin.$anchor.index(_this);

			if(_this.hasClass(plugin.options.activeClassName)){

				plugin.dropdownClose( idx );

			}else{

				if(!plugin.options.multi){

					plugin.$panel.each(function(i,e){

						if(idx !== i) {
							plugin.dropdownClose( i );
						}
					});
				}
				plugin.dropdownOpen( idx );

			}

			event.preventDefault();
		},

		dropdownAll : function(){
			var plugin =  this;
		},

		dropdownOpen : function( idx ){
			var plugin = this;
			var btn = plugin.$anchor.eq(idx);
			var cont = plugin.$panel.eq(idx);
			var $status = btn.find('[data-js=status_text]');
			var openTween = {};
			plugin.options.currentAnchor = btn;
			plugin.options.currentPanel = cont;

			function openAfter() {
				cont.removeAttr("style");
				if(plugin.options.onCompleteAccordion !== null){
					plugin.onCompleteAccordion();
				} else {
					plugin.$element.trigger('ACCORDION_OPEN_END',{
						index : idx,
						anchor: btn,
						panel : cont
					});
					cont.addClass(plugin.options.openComplateClassName);
				}

                if(plugin.$element.closest('.c-modal').length){
                    $(window).trigger('resize');
                }

                var $gnb = $('[data-js="gnb"]');
                if(plugin.options.scrollTop && (btn.offset().top - $gnb.outerHeight()) - $(window).scrollTop() < $gnb.outerHeight()){
                    $('html, body').stop().animate({scrollTop:btn.offset().top - $gnb.outerHeight()}, plugin.options.speed * 1000);
				}
			}

			$status.text('close');
			btn.attr("aria-expanded", "true").addClass(plugin.options.activeClassName);
			// btn.attr("aria-controls", );
			cont.addClass(plugin.options.activeClassName);
			openTween.height = cont.outerHeight();
			openTween.ease = Expo.ease;
			openTween.onComplete = openAfter;
			TweenMax.killTweensOf(cont);
			TweenMax.set(cont,{height:0});
			TweenMax.to(cont, plugin.options.speed, openTween);

			plugin.$element.trigger('ACCORDION_OPEN_START',{
				index : idx,
				anchor: btn,
				panel : cont
			});
		},

		dropdownClose : function( idx ){
			var plugin = this;

			var btn = plugin.$anchor.eq(idx);
			var cont = plugin.$panel.eq(idx);
			var closeTween = {};
			var $status = btn.find('[data-js=status_text]');

            if(!cont.is(':visible')) return;

			plugin.options.currentAnchor = btn;
			plugin.options.currentPanel = cont;
			cont.removeClass(plugin.options.openComplateClassName);

			function closeAfter() {
				cont.removeAttr('style').removeClass(plugin.options.activeClassName);
				if(plugin.options.onCompleteAccordion !== null){
					plugin.onCompleteAccordion();
				}else{
					plugin.$element.trigger('ACCORDION_CLOSE_END',{
						index : idx,
						anchor: btn,
						panel : cont
					});
				}
			}

			$status.text('open');
			btn.attr("aria-expanded", "false").removeClass(plugin.options.activeClassName);

			closeTween.height = 0;
			closeTween.ease = Expo.ease;
			closeTween.onComplete = closeAfter;
			TweenMax.killTweensOf(cont);
			TweenMax.to(cont, plugin.options.speed, closeTween);

			plugin.$element.trigger('ACCORDION_CLOSE_START',{
				index : idx,
				anchor: btn,
				panel : cont
			});
		},

		onLoadAccordion : function() {
			var plugin = this,
				onLoadAccordion = plugin.options.onLoadAccordion;
			if ( typeof onLoadAccordion === 'function' ) {
				onLoadAccordion.apply( plugin, [plugin] );
			} else if ( typeof onLoadAccordion === 'string' ){
				if( typeof window[onLoadAccordion] === 'function'){
					window[onLoadAccordion]( plugin );
				}
			}
		},

		onCompleteAccordion : function() {
			var plugin = this,
				onCompleteAccordion = plugin.options.onCompleteAccordion;
			if ( typeof onCompleteAccordion === 'function' ) {
				onCompleteAccordion.apply( plugin, [plugin] );
			} else if ( typeof onCompleteAccordion === 'string' ){
				if( typeof window[onCompleteAccordion] === 'function'){
					window[onCompleteAccordion]( plugin );
				}
			}
		},

		onDestroyAccordion : function() {
			var plugin = this,
				onDestroyAccordion = plugin.options.onDestroyAccordion;
			if ( typeof onDestroyAccordion === 'function' ) {
				onDestroyAccordion.apply( plugin, [plugin] );
			} else if ( typeof onDestroyAccordion === 'string' ){
				if( typeof window[onDestroyAccordion] === 'function'){
					window[onDestroyAccordion]( plugin );
				}
			}
		}
	});

})(jQuery, window, document);