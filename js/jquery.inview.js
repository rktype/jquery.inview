/*!
 * jQuery inView plugin
 * 
 * Copyright Mirko Renzetti
 */

(function($) {
	$.fn.inview = function(options) {

		var defaults = {
			'viewFactor': 0.3,
			'onEnter': function($object) {
			},
			'onLeave': function($object) {
			}
		};
		var custom = $.extend(defaults, options);

		var blockList = [];

		this.each(function() {
			var $block = $(this);

			var block = {};
			block.top = $block.offset().top;
			block.height = $block.innerHeight();
			block.bottom = block.top + block.height;
			block.obj = $block;
			block.inView = null;

			blockList.push(block);
		});

		var globaList = $(window).data('inView.globaList') || [];
		globaList.push({
			'options': custom,
			'blockList': blockList
		});
		$(window).data('inView.globaList', globaList);
		
		function changeWindow() {
			var documentTop = $(window).scrollTop();
			var documentBottom = documentTop + $(window).innerHeight();

			var globaList = $(window).data('inView.globaList');
			
			for (var j = 0; j < globaList.length; j++) {
				var options = globaList[j].options;
				var blockList = globaList[j].blockList;
				for (var i = 0; i < blockList.length; i++) {
					var block = blockList[i];

					var top = Math.max(documentTop, block.top);
					var bottom = Math.min(documentBottom, block.bottom);

					var height = bottom - top;

					if (block.inView !== true && height / block.height >= options.viewFactor) {
						blockList[i].inView = true;
						block.obj.addClass(block.obj.data('class-in'));
						block.obj.removeClass(block.obj.data('class-out'));
						if(typeof options.onEnter === 'function')
							options.onEnter(block.obj);

					} else if (block.inView !== false && height <= 0) {
						blockList[i].inView = false;
						block.obj.addClass(block.obj.data('class-out'));
						block.obj.removeClass(block.obj.data('class-in'));
						if(typeof options.onLeave === 'function')
							options.onLeave(block.obj);

					}
				}
			}
		}

		if (!$(window).data('inView.initialized')) {
			$(window).data('inView.initialized', true);
			$(window).on({
				'scroll': changeWindow,
				'resize': changeWindow
			});
		}
		$(window).trigger('resize');

	};
})(jQuery);
