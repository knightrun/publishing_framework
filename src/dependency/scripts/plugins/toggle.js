
/**
 *  jQuery toggle
 *  레이어 열림 닫힘
 *  $(element).toggle({
		$panel : null,
		$close : null
	);
 *
 */
;(function($, window, document, undefined) {
	var pluginName = 'toggle',
		_uuid = 0;

	$.fn[pluginName] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});

		return this;
	};

	$.fn[pluginName].defaults = {
		mode : 'static',		    // slide, fade, static
		speed : 300,
		initOpen : false,
		easing : 'swing',

		isAutoOpen : true,
		isAutoClose : false,
		isAutoFocus : true,
		isLockScroll : true,

		$panel : null,
		$close : null,

		stateText : {
			open : 'open',
			close : 'close'
		},
		activeClass : 'is-active',

		onBeforeOpen : null,
		onAfterOpen : null,
		onBeforeClose : null,
		onAfterClose : null
	};

	function Plugin ( element, options ) {
		this.element = element;
		this._name = pluginName;
		this._defaults = $.fn[pluginName].defaults;
		this._options = options;
		this.isOpen = false;
		this.isInit = true;
		this._uuid = _uuid++;
		this.init();
	}

	$.extend( Plugin.prototype, {

		init : function () {
			this.buildCache();
			this.bindEvents();

			if( this.options.initOpen ){
				this.open();
			} else {
				this.close();
			}
			this.isInit = false;
		},

		destroy : function(){
			var plugin = this;

			plugin.$anchor
				.removeAttr('aria-controls aria-expanded aria-label')
				.removeClass( plugin.options.activeClass );

			plugin.$panel.removeAttr('aria-hidden style tabindex');
			if( !plugin.$panel.data('hasId') ){
				plugin.$panel.removeAttr('id');
			}
			plugin.unbindEvents();
			plugin.$anchor.removeData('plugin_' + pluginName);
			plugin = null;
		},

		update : function(){
			var plugin = this;
			plugin.unbindEvents();
			plugin.buildCache();
			plugin.bindEvents();
		},

		buildCache : function(){
			var plugin = this;

			plugin.$anchor = $( plugin.element );
			plugin.options = $.extend( {}, plugin._defaults, plugin._options );
			//console.log(plugin.options)
			plugin.$panel = $( plugin.options.$panel );
			plugin.$close = null;
			plugin.$focusFirst = null;
			plugin.$focusLast = null;

			var focusEls = FES.MD.FOCUSABLE( plugin.$panel );

			plugin._panelId = plugin.$panel.attr('id');
			plugin._panelId && plugin.$panel.data('hasId',true);

			if( !plugin._panelId ){
				plugin.$panel.attr('id', plugin._name+'-'+plugin._uuid );
				plugin._panelId = plugin._name+'-'+plugin._uuid;
			}

			plugin.$anchor.attr('aria-controls', plugin._panelId );

			plugin.$focusFirst = $( focusEls.el_firstFocus );
			plugin.$focusLast = $( focusEls.el_lastFocus );

			if( plugin.options.$close ){
				plugin.$close = plugin.$panel.find( plugin.options.$close );
			}
		},
		
		updateFocusable : function(){
			var plugin = this;
			var focusEls = FES.MD.FOCUSABLE( plugin.$panel, true );

			plugin.unbindPanelEvent();
			
			plugin.$focusFirst = $( focusEls.el_firstFocus );
			plugin.$focusLast = $( focusEls.el_lastFocus );
			plugin.bindPanelEvent();
		},

		open : function(){
			var plugin = this;


			plugin.onBeforeOpen();
			plugin.changeState( true );
			plugin.$anchor.addClass( plugin.options.activeClass );

			plugin.layerAction('open', function(){
				plugin.updateFocusable();
				// var focusEls = FES.MD.FOCUSABLE( plugin.$panel, true );
				// plugin.$focusFirst = $( focusEls.el_firstFocus );
				// plugin.$focusLast = $( focusEls.el_lastFocus );
				// plugin.bindPanelEvent();
				if( !plugin.isInit ){
					if( plugin.options.isLockScroll ){
					    //console.log("plugin.options" , plugin.options)
					    //console.log("plugin.options.isAutoFocus" , plugin.options.isAutoFocus)
						if( _.isUndefined( plugin.$panel.attr('tabindex') ) && plugin.options.isAutoFocus ) plugin.$panel.attr('tabindex', '-1');
						FES.MD.focusWithOutScroll( plugin.$panel, plugin.options.isAutoFocus );
					} else {
						plugin.$panel.focus();
					}
				}
				plugin.isOpen = true;
				plugin.onAfterOpen();
			});

			plugin.$panel.attr({
				'tabindex' : '-1'
			}).on('focusout'+'.'+plugin._name, function(e){
				e.stopPropagation();
				$(this).removeAttr('tabindex').off('focusout.'+plugin._name);
			});

            if (FES.VARS.IS_HAND_DEVICE) {
                plugin.$panel.removeAttr('tabindex');
			}

			if( plugin.options.isAutoClose ){
				plugin.$panel.on('keydown'+'.'+plugin._name, function(e){

					if (e.keyCode === 9 && e.shiftKey && e.target === this ) {
						e.preventDefault();
						e.stopPropagation();
						plugin.close();
					}
				});

			}

		},

		close : function( isForceClose ){
			var plugin = this;

			plugin.onBeforeClose();
			plugin.changeState( false );
			plugin.$anchor.removeClass( plugin.options.activeClass );
			plugin.isInit || isForceClose || plugin.$anchor.focus();
			plugin.layerAction('close', function(){
				plugin.isOpen = false;
				plugin.onAfterClose();
				plugin.unbindPanelEvent();
			});
            plugin.$panel.trigger('TOGGLE_CLOSE');
			// if( plugin.options.isAutoClose ){
			// 	plugin.$panel.off('keydown'+'.'+plugin._name);
			// }
		},

		changeState : function( isActive ){
			var plugin = this;
			isActive = !!isActive;

			plugin.$anchor.attr({
				'aria-expanded' : isActive,
				'aria-label' : isActive ? plugin.options.stateText.close : plugin.options.stateText.open
			});

			plugin.$panel.attr({
				'aria-hidden' : !isActive
			});
		},

		layerAction : function( setOpen, callback ){
			var plugin = this,
				speed = plugin.options.speed,
				easing = plugin.options.easing;

			setOpen = (setOpen === 'open');

			({
				'slide' : function(){
					if( setOpen ){
						plugin.$panel.slideDown( speed, easing, function(){
							callback && callback();
						});
					} else {
						plugin.$panel.slideUp( speed, easing, function(){
							callback && callback();
						});
					}
				},
				'fade' : function(){
					if( setOpen ){
						plugin.$panel.fadeIn( speed, easing, function(){
							callback && callback();
						});
					} else {
						plugin.$panel.fadeOut( speed, easing, function(){
							callback && callback();
						});
					}
				},
				'static' : function(){
					if( setOpen ){
						plugin.$panel.show();
						callback && callback();
					} else {
						plugin.$panel.hide();
						callback && callback();
					}
				}
			})[ plugin.options.mode ]();
		},


		onBeforeOpen : function(){
			var plugin = this,
				onBeforeOpen = plugin.options.onBeforeOpen;

			if ( typeof onBeforeOpen === 'function' ) {
				onBeforeOpen.apply( plugin.element, [plugin] );
			}
		},

		onAfterOpen : function(){
			var plugin = this,
				onAfterOpen = plugin.options.onAfterOpen;

			if ( typeof onAfterOpen === 'function' ) {
				onAfterOpen.apply( plugin.element, [plugin] );
			}
		},

		onBeforeClose : function(){
			var plugin = this,
				onBeforeClose = plugin.options.onBeforeClose;

			if ( typeof onBeforeClose === 'function' ) {
				onBeforeClose.apply( plugin.element, [plugin] );
			}
		},

		onAfterClose : function(){
			var plugin = this,
				onAfterClose = plugin.options.onAfterClose;

			if ( typeof onAfterClose === 'function' ) {
				onAfterClose.apply( plugin.element, [plugin] );
			}
		},

		afterChange : function( $activeItemEl ){
			var plugin = this,
				onAfterChange = plugin.options.onAfterChange;

			if ( typeof onAfterChange === 'function' ) {
				onAfterChange.apply( plugin.element, [plugin, $activeItemEl] );
			}
		},

		bindEvents : function(){
			var plugin = this;

			if( plugin.options.isAutoOpen ){
				plugin.$anchor.on('click'+'.'+plugin._name, function(e){
					e.preventDefault();
					e.stopPropagation();
					plugin.isOpen ? plugin.close() : plugin.open();
				});
			}

			plugin.$panel
				.on('open'+'.'+plugin._name, function(e){
					e.stopPropagation();
					e.preventDefault();
					plugin.isOpen || plugin.open();
				})
				.on('close'+'.'+plugin._name, function(e){
					e.stopPropagation();
					e.preventDefault();
					plugin.isOpen && plugin.close();
				});
		},

		unbindEvents : function(){
			var plugin = this;
			plugin.$anchor.off('.'+plugin._name);
			plugin.$panel.off('.'+plugin._name);

		},

		bindPanelEvent : function(){
			var plugin = this;

			if( plugin.options.isAutoClose ){

				plugin.$focusFirst && plugin.$focusFirst.on('keydown'+'.'+plugin._name, function(e){
					if (e.keyCode === 9 && e.shiftKey) {
						e.preventDefault();
						e.stopPropagation();
						plugin.close();
					}
				});

				plugin.$focusLast && plugin.$focusLast.on('keydown'+'.'+plugin._name, function(e){
					if (e.keyCode === 9 && !e.shiftKey) {
						e.preventDefault();
						e.stopPropagation();
						plugin.close();
					}
				});

				$(document).on('mouseup'+'.'+plugin._name+'-'+plugin._uuid, function(e){
					if( plugin.isOpen ){
						e.stopPropagation();
						if( !$(e.target).closest( plugin.$panel).length && !$(e.target).is( plugin.$anchor ) ){
							plugin.close('force');
						}
					}
				});
			}

			plugin.$panel
				.on('close'+'.'+plugin._name, function(e){
					e.stopPropagation();
					e.preventDefault();
					plugin.isOpen && plugin.close();
				});

			plugin.$close && plugin.$close.on('click'+'.'+plugin._name, function(e){
				e.preventDefault();
				e.stopPropagation();
				plugin.close();
			});
		},

		unbindPanelEvent : function(){
			var plugin = this;

			plugin.$close && plugin.$close.off('click.'+plugin._name);
			plugin.$focusFirst && plugin.$focusFirst.off('keydown.'+plugin._name);
			plugin.$focusLast && plugin.$focusLast.off('keydown.'+plugin._name);
			plugin.$panel && plugin.$panel.off('close.'+plugin._name);
			$(document).off('mouseup.'+plugin._name+'-'+plugin._uuid);
		}
	});

})(jQuery, window, document);
