/**
 *  탭
 *  $(element).tab();
 */
;(function($, window, document, undefined) {
	var pluginName = 'tab';

	$.fn[pluginName] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});

		return this;
	};

	$.fn[pluginName].defaults = {
		mode : 'static',    // static, slide, fade
		event : 'click',    // 'mouseenter focusin'
		speed : 300,
		easing : 'swing',
		anchorEl : '[data-js="tab__anchor"]',
		panelEl : '[data-js="tab__panel"]',
		activeClassName : 'is-active',
		disabledClassName : 'is-disabled',
		withScroll : false,
		isInitActive : true,
		initIndex : 0,
		onChangeBefore : null,
		onChangeAfter : null
	};


	function Plugin ( element, options ) {
		this.element = element;
		this._name = pluginName;
		this._defaults = $.fn[pluginName].defaults;
		this.options = $.extend( {}, this._defaults, options );
		this.flag = false;
		this.idx = 0;
		this.init();
	}

	$.extend( Plugin.prototype, {

		init : function () {
			var plugin = this;
			plugin.buildCache();
			plugin.bindEvents();
			if( plugin.options.isInitActive ){
				plugin.$anchor.eq( plugin.options.initIndex ).trigger( plugin.options.event );
			}
		},

		destroy : function(){
			var plugin = this;
			plugin.unbindEvents();
			plugin.$wrap.removeAttr('role');
			plugin.$anchor
				.removeData(plugin._name+'_target index')
				.removeAttr('style role')
				.removeClass( plugin.options.activeClassName );
			plugin.$panel
				.removeAttr('style role aria-labelledby')
				.removeClass( plugin.options.activeClassName );
			plugin.flag = false;

			plugin.$wrap.removeData('plugin_' + pluginName);
		},

		buildCache : function(){
			var plugin = this;
			var tabsId = [];

			plugin.$wrap = $( plugin.element).attr('role','tablist');
			plugin.$anchor = plugin.$wrap.find( plugin.options.anchorEl);
			plugin.$panel = plugin.$wrap.find( plugin.options.panelEl);

			plugin.$anchor.each(function(index){
				var $this = $(this);
				var _id = $this.attr('id') ? $this.attr('id') : _.uniqueId('js-unique-');

				$this
					.data( plugin._name+'_target', plugin.$panel.eq(index) )
					.data( 'index' , index )
					.attr({
						'id' : _id,
						'role' : 'tab'
					});

				tabsId.push( _id );
			});

			plugin.$panel.each(function(index){
				$(this).attr({
					'aria-labelledby' : tabsId[index],
					'role' : 'tabpanel'
				});
			});
		},

		bindEvents : function(){
			var plugin = this;

			$.each( plugin.options.event.split(' ') , function(idx,eventName){

				plugin.$anchor.on( eventName+'.'+plugin._name,function(e){
					e.stopPropagation();
					var $this = $(this);

					if( $this.attr('href') == '#'){
						e.preventDefault();
					}
					if( $this.hasClass( plugin.options.activeClassName ) || $this.hasClass( plugin.options.disabledClassName ) || plugin.flag ){ return ; }

					plugin.idx = $(this).data('index');
					plugin.hide( this );
					plugin.show( this );
				});

			});

			plugin.$wrap.on('active.'+plugin._name,function( ev, index, withScroll ){
				plugin.$anchor.eq( index ).trigger( plugin.options.event );
				if( withScroll ){
					$(window).scrollTop( plugin.$wrap.offset().top );
				}
			})
		},

		unbindEvents : function(){
			var plugin = this;
			plugin.$anchor.off('.'+plugin._name).removeData(plugin._name+'_target');
			plugin.$wrap.off('.'+plugin._name);
		},

		beforeChange : function( $anchor, $panel ){
			var plugin = this,
				onChangeBefore = plugin.options.onChangeBefore;

			if ( typeof onChangeBefore === 'function' ) {
				onChangeBefore.apply( plugin.element, [plugin, $anchor, $panel ] );
			}
		},
		afterChange : function( $anchor, $panel ){
			var plugin = this,
				onChangeAfter = plugin.options.onChangeAfter,
				$slick = $panel.find('.slick-slider');

			if($slick.length){
                $slick.each(function(){
                	var $this = $(this);
                	//if($this.outerHeight() < 1){
                        $this.slick('setPosition');
					//}
				});
			}

			if ( typeof onChangeAfter === 'function' ) {
				onChangeAfter.apply( plugin.element, [plugin, $anchor, $panel ] );
			}
		},

		show : function( _target ){
			var plugin = this,
				$anchor = $( _target );

			var $panel = $anchor
				.addClass( plugin.options.activeClassName)
				.attr('aria-selected',true)
				.data( plugin._name+'_target' )
				.addClass( plugin.options.activeClassName );

			plugin.flag = true;
			plugin.beforeChange( $anchor, $panel );

			if( plugin.options.mode == 'fade'){
				$panel.stop().fadeIn( plugin.options.speed, plugin.options.easing, function(){
					plugin.flag = false;
					plugin.afterChange( $anchor, $panel );
				});
			} else if( plugin.options.mode == 'slide'){
				$panel.stop().slideDown( plugin.options.speed, plugin.options.easing, function(){
					plugin.flag = false;
					plugin.afterChange( $anchor, $panel );
				});
			} else {
				$panel.stop().show();
				plugin.flag = false;
				plugin.afterChange( $anchor, $panel );
			}
			if( plugin.options.withScroll ){
				$(window).scrollTop( plugin.$wrap.offset().top );
			}
		},

		hide : function( _except ){
			var plugin = this;

			plugin.$anchor.not( _except ).each(function(){
				var $panel = $(this)
					.removeClass( plugin.options.activeClassName )
					.attr('aria-selected',false)
					.data( plugin._name+'_target')
					.removeClass( plugin.options.activeClassName );

				if( plugin.options.mode == 'fade'){
					$panel.stop().fadeOut( plugin.options.speed, plugin.options.easing );
				} else if( plugin.options.mode == 'slide'){
					$panel.stop().slideUp( plugin.options.speed, plugin.options.easing );
				} else {
					$panel.stop().hide();
				}
			});
		}
	});

})(jQuery, window, document);