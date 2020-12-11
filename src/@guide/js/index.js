(function($){
	function validateInit() {
		var $htmlValiBtn = $('.html-validator');
		var $cssValiBtn = $('.css-validator');

		function validate(e) {
			var $this = $(this);
			var url = $this.closest('td').siblings('td').find('a').attr('href').replace(/\..\//gi,'');
			var domain = "http://test.com/2/dist/";
			if(url == "#lnk") {
				alert("url undefined");
				return;
			}
			if(e.data.valiType == "html") {
				window.open('https://validator.w3.org/nu/?showsource=yes&doc='+domain+url, "_blank")
			} else {
				window.open('https://jigsaw.w3.org/css-validator/validator?uri='+domain+url+"&profile=css3&usermedium=all&warning=1&vextwarning=&lang=ko", "_blank")
			}
		}

		function addEvnet() {
			$htmlValiBtn.on('click', { valiType : 'html' }, validate );
			$cssValiBtn.on('click', { valiType : 'css' }, validate );
		}

		function linkAdd() {
			var $preLink = $('.preview');
			$preLink.each(function(){
				var $this = $(this);
				var url = $this.siblings('.left').find('a').attr('href');
				$this.find('a').attr('href', '/@guide/index-info.html?url=' + url);
			})
		}

		linkAdd();
		addEvnet();
	}



	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	var url = getParameterByName('url');
	var urlArr = url.split('/');
	var name = urlArr[ urlArr.length-2 ];

	function documentPreview() {
		var $codeBox = $('.code-pre:not(".sample-code") pre');
		var $sampleCodeBox = $('.sample-code pre');
		var $iframe = $('.iframe-preview iframe');

		// $.get(url, function( data ){
		// 	$codeBox.text(data);
		// 	$codeBox.addClass("prettyprint");
		// });
		// $iframe.attr('src', url);

		$sampleCodeBox.addClass("prettyprint");
		window.prettyPrint && prettyPrint()
	}

	function copyInit() {
		
	}

	function scrollInit(){
        $('.scrollbar-inner').scrollbar();
	}

	function indexInit (){
		validateInit();
		documentPreview();
		copyInit();
		scrollInit();
	}

	$(document).on('ready', indexInit);



})(jQuery);
