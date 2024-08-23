$.fn.translateX = function(length, duration) {
	this.css({
		'transition': 'transform',
		'transform': `translate(${length}px, 0, 0)`,
	});

	if(duration) {
		this.css({'transition-duration': `${duration}ms`});
	};

	return this;
}

// To translate, modify pageNumber and call translateContainer;
// Pass id, swipesPerView
/* 
Events available to call from properties:
	click
	resize
	pageNumberChanged
	reachBeginning
	reachIntermediate
	reachEnd
*/
function initCarousel(properties) {
	let swiper = {
		swipesPerView: properties.swipesPerView,
		tailwindGap: 'gap-x-8',
		tailwindUnitGap: 8,
		swipesPerView: 3,
		pageNumber: 0,
		translateContainer: translateContainer,
		getSlideWidth: getSlideWidth,
	}

	let $swiperContainer = $('#' + properties.id)

	let currentTransitionPosition = 0;

	$(window).on('resize', function () {
		let width = $(this).outerWidth();
		let lg = 1024;
		let md = 768;
		let sm = 640;

		if(width >= lg) {
			swiper.swipesPerView = 3;
		} else if(width >= md) {
			swiper.swipesPerView = 2;
		}
		else {
			swiper.swipesPerView = 1;
		}

		// set min width to each swiper element.
		$swiperContainer.addClass(swiper.tailwindGap).children().each(function (index, element) {
			let $element = $(element);
			$element.css('min-width', getSlideWidth());
		});

		// retranslate as slide width may have changed due to the resize.
		translateContainer();

		if(properties.resize) {
			properties.resize();
		}
	});

	let amountMoved;
	let mousedown;
	let initialMousePositionX;
	let initialMousePositionY;
	let mousemove;
	let tolerance = 10;

	$swiperContainer.children().on('mousedown', function (event) {
		initialMousePositionX = event.pageX;
		initialMousePositionY = event.pageY;
		mousedown = true;
	}).on('mouseup', function (event) {
		if(Math.abs(event.pageX - initialMousePositionX) < tolerance && Math.abs(event.pageY - initialMousePositionY) < tolerance) {
			if(properties.click) {
				properties.click($(this));
			}
		}
	});
	$(window).on('mousemove', function (event) {
		if(mousedown) {
			amountMoved = event.pageX - initialMousePositionX;
			if(Math.abs(amountMoved) > tolerance) {
				mousemove = true;
				$swiperContainer.translateX(currentTransitionPosition + amountMoved);
			}
		}
	}).on('mouseup', function () {
		mousedown = false;
		if(mousemove) {
			mousemove = false;

			currentTransitionPosition += amountMoved;

			if(currentTransitionPosition > 0) {
				swiper.pageNumber = 0;
				translateContainer(true);
			}
			else {
				swiper.pageNumber = Math.floor(Math.abs(Math.round(currentTransitionPosition / getSlideWidthWithGap())));
				translateContainer(true);
			}
		}
	});

	function translateContainer(animate, duration) {
		let isFirstPage;
		let isLastPage;

		if(!duration) {
			duration = 300;
		}

		let lastPage = $swiperContainer.children().length - swiper.swipesPerView;

		if(swiper.pageNumber <= 0) {
			swiper.pageNumber = 0;
			isFirstPage = true;
		} else if(swiper.pageNumber >= lastPage) {
			swiper.pageNumber = lastPage;
			isLastPage = true;
		}

		let translateDistance = -(getSlideWidthWithGap() * swiper.pageNumber); // negative to move the container to the left.

		if(animate) {

			$swiperContainer.translateX(translateDistance, duration);

		} else {

			$swiperContainer.translateX(translateDistance);
		}

		currentTransitionPosition = translateDistance;

		if(properties.pageNumberChanged) {
			properties.pageNumberChanged();
		}

		if(isFirstPage && properties.reachBeginning) {
			properties.reachBeginning();
		}

		if(isLastPage && properties.reachEnd) {
			properties.reachEnd();
		}

		if(!isFirstPage && !isLastPage && properties.reachIntermediate) {
			properties.reachIntermediate();
		}
	}

	function getSlideWidthWithGap() {
		return getSlideWidth() + (swiper.tailwindUnitGap * 4);
	}

	function getSlideWidth() {
		let width = $swiperContainer.outerWidth();
		let gap = swiper.tailwindUnitGap * 4;
		let totalGapWidth = gap * (swiper.swipesPerView - 1);
		let swiperWidth = (width - totalGapWidth) / swiper.swipesPerView;
		return swiperWidth;
	}

	$(window).trigger('resize');

	return swiper;
}