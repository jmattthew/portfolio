function CSSVal(theID,theClass,theProp) {
	// For all animated elements,
	// the JS only specifies animation timing,
	// while the from: & to: property values
	// are stored in the CSS stylesheets.
	// This function gets those property values
	// from the stylesheets

	theID = theID.substring(1,theID.length);
	var cap = theProp.match(/[A-Z]/g);
	if(cap) {
		theProp = theProp.replace(cap[0],'-'+cap[0].toLowerCase());
	}
	if(theProp.indexOf('-'))
	var $el = $(document.createElement('div'));
	$el.css('display','none');
	$el.attr('id',theID);
	$el.addClass(theClass);
	$('body').append($el);
	var theValue = window.getComputedStyle($el[0], null).getPropertyValue(theProp);
	$el.remove();
	return theValue;
}

function showFakeKeyboard(show) {
	// on mobile device, real keyboard
	// will cause aspect ratio to be <1.4
	if($(window).height()/$(window).width() > 1.4) {
		if(show) {
			$('#fakeKeyboard').removeClass('hidden');
			$('#help_actions').removeClass('realkeyboard');
		} else {
			// gives help buttons time to re-establish focus
			setTimeout(function(){
				if(!$('#intentions_input').is(":focus")) {
					$('#fakeKeyboard').addClass('hidden');
					$('#help_actions').addClass('realkeyboard');
				}
			},10);
		}
	}
}

function pickAnimation($el) {
	if($el.data('moveable')) {
		if(coverPos == 'top') {
			animateToSplit('top');
		} else if(coverPos == 'bottom') {
			animateToSplit('bottom');
		} else if(coverPos == 'split') {
			if($el.attr('id') == 'cover_upper') {
				animateToBottom();
			} else {
				animateToTop();
			}
		}
	}
}

function animateToSplit(animateFrom) {
	coverPos = 'split';

	var tl1 = new TimelineLite();
	var tl2 = new TimelineLite();
	var top = 0;

	var s = 2.5;

	if(animateFrom == 'top') {
		// move covers to bottom together
		top = $(window).height() - (coverSize*2) - marginBottom;
		tl1
			.to(covU, s, {
				ease : 				Elastic.easeOut.config(1.5, 0.75),
				'top' : 			top
			})
			.to(covUB, s, {
				ease : 				Elastic.easeOut.config(2, 0.75),
				'top' : 			top * -1
			},'-='+s)
			.to(covL, s, {
				ease : 				Elastic.easeOut.config(1.5, 0.75),
				'top' : 			top + coverSize
			},'-='+s)
			.to(covLB, s, {
				ease : 				Elastic.easeOut.config(2, 0.75),
				'top' : 			(top + coverSize) * -1
			},'-='+s)
			.add(function() {
				$(covU + ',' + covL).removeClass('cover_pos_top cover_pos_bottom').addClass('cover_pos_split');
			})
		;
		// move to split
		top = marginTop;
		tl2
			.to(covU, (s/2), {
				ease : 				Elastic.easeOut.config(0.5, 0.5),
				'border-bottom-left-radius' : radMax,
				'border-bottom-right-radius' : radMax,
				'top' : 			top
			},'+='+(s/3.5))
			.to(covUB, (s/2), {
				ease : 				Elastic.easeOut.config(0.75, 0.5),
				'top' : 			(top) * -1
			},'-='+(s/2))
			.to(covL, (s/2), {
				'border-top-left-radius' : radMax,
				'border-top-right-radius' : radMax,
			},'-='+(s/2))
			.add(function() {
				$(covU + ',' + covL).removeClass('cover_pos_top cover_pos_bottom').addClass('cover_pos_split');
			})
		;
	} else if(animateFrom == 'bottom') {
		// move covers to top together
		top = marginTop;
		tl1
			.to(covU, s, {
				ease : 				Elastic.easeOut.config(1.5, 0.75),
				'top' : 			top
			})
			.to(covUB, s, {
				ease : 				Elastic.easeOut.config(2, 0.75),
				'top' : 			top * -1
			},'-='+s)
			.to(covL, s, {
				ease : 				Elastic.easeOut.config(1.5, 0.75),
				'top' : 			top + coverSize
			},'-='+s)
			.to(covLB, s, {
				ease : 				Elastic.easeOut.config(2, 0.75),
				'top' : 			(top + coverSize) * -1
			},'-='+s)
		;
		// move to split
		top = $(window).height() - (coverSize*2) - marginBottom;
		tl2
			.to(covU, (s/2), {
				'border-bottom-left-radius' : radMax,
				'border-bottom-right-radius' : radMax,
			},'+='+(s/3.5))
			.to(covL, (s/2), {
				ease : 				Elastic.easeOut.config(0.5, 0.5),
				'border-top-left-radius' : radMax,
				'border-top-right-radius' : radMax,
				'top' : 			top + coverSize
			},'-='+(s/2))
			.to(covLB, (s/2), {
				ease : 				Elastic.easeOut.config(0.75, 0.5),
				'top' : 			(top + coverSize) * -1
			},'-='+(s/2))
		;
	}
}

function animateToBottom() {
	coverPos = 'bottom';

	var tl1 = new TimelineLite();
	var top = 0;
	var s = 0.25;

	// move covers to bottom together
	$(covU + ',' + covL).removeClass('cover_pos_split').addClass('cover_pos_bottom');
	top = Math.ceil($(window).height() - (coverSize*2) + (coverSize/2) - marginBottom); // ceil needed to prevent 1px gaps
	TweenLite.to(covU, s, {
		'top' : 			top,
		'border-bottom-left-radius' : 0,
		'border-bottom-right-radius' : 0,
	});
	TweenLite.to(covUB, s, {
		'top' : 			top * -1,
	});
	TweenLite.to(covL, s, {
		delay : 			s/2,
		'top' : 			top + coverSize,
		'border-top-left-radius' : 0,
		'border-top-right-radius' : 0,
	});
	TweenLite.to(covLB, s, {
		delay : 			s/2,
		'top' : 			(top + coverSize) * -1
	});

	// wobble
	top = $(window).height() - (coverSize*2) - marginBottom;
	TweenLite.to(covU, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(0.1, 0.4),
		'top' : 			top
	});
	TweenLite.to(covUB, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(1, 0.4),
		'top' : 			top * -1
	});
	TweenLite.to(covL, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(1.25, 0.5),
		'top' : 			top + coverSize,
	});
	TweenLite.to(covLB, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(1, 0.4),
		'top' : 			(top + coverSize) * -1
	});
}

function animateToTop() {
	coverPos = 'top';

	var tl1 = new TimelineLite();
	var top = 0;
	var s = 0.25;

	// move covers to top together
	$(covU + ',' + covL).removeClass('cover_pos_split').addClass('cover_pos_top');
	top = marginTop - (coverSize/2);
	TweenLite.to(covU, s, {
		delay : 			s/2,
		'top' : 			top,
		'border-bottom-left-radius' : 0,
		'border-bottom-right-radius' : 0,
	});
	TweenLite.to(covUB, s, {
		delay : 			s/2,
		'top' : 			top * -1
	});
	TweenLite.to(covL, s, {
		'top' : 			top + coverSize,
		'border-top-left-radius' : 0,
		'border-top-right-radius' : 0,
	});
	TweenLite.to(covLB, s, {
		'top' : 			(top + coverSize) * -1
	});

	// wobble
	top = marginTop;
	TweenLite.to(covU, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(1.25, 0.5),
		'top' : 			top
	});
	TweenLite.to(covUB, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(1, 0.4),
		'top' : 			top * -1
	});
	TweenLite.to(covL, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(0.1, 0.4),
		'top' : 			top + coverSize
	});
	TweenLite.to(covLB, s*4, {
		delay : 			s,
		ease : 				Elastic.easeOut.config(1, 0.4),
		'top' : 			(top + coverSize) * -1
	});
}

function setcoverSize() {
	console.log('coverAmount: ' + coverAmount);
	// unique actions for each coverAmount
	if(countDown) {
		coverSize = ($(window).height() - marginTop - marginBottom)/2;
		$(covU + ',' + covL).css({
			'opacity' : 1
		});
		animateToTop();
	} else {
		coverSize = ($(window).height() - marginTop - marginBottom) * (coverMax) * (coverAmount / 100);
		coverSize = coverSize < coverMin ? coverMin : coverSize;
		if(coverAmount == 0) {
			animateToSplit('top');
		}
		if(coverAmount < 10) {
			// hide lower cover
			$(covL).data('moveable',false);
			$(covL).draggable('option','disabled',true);
			TweenLite.to(covL, 1, {
				'opacity' : 0
			});
		}
		if(coverAmount == 10) {
			// show lower cover and first message
			$(covL).data('moveable',true);
			$(covL).draggable('option','disabled',false);

			TweenLite.to(covL, 1, {
				delay : 0.25,
				'opacity' : 1
			});
			$(covL + ' .message span').html(MessageIntro);
			TweenLite.to($(covL + ' .message'), 0.5, {
				delay : 1,
				'height' : 32,
			});
		}
		if(coverAmount < 20) {
			// hide upper cover
			$(covU).data('moveable',false);
			$(covU).draggable('option','disabled',true);
			TweenLite.to(covU, 1, {
				'opacity' : 0
			});
		}
		if(coverAmount == 20) {
			// show upper cover
			$(covU).data('moveable',true);
			$(covU).draggable('option','disabled',false);
			TweenLite.to(covU, 1, {
				'opacity' : 1
			});
			// remove 2nd message
			$(covL + ' .message').eq(1).remove();
		}
		if(coverAmount == 30 && $(covL + ' .message').length < 2) {
			// show second message
			$el = $(covL + ' .message').eq(0).clone();
			$el.find('span').html(MessageUsage);
			$el.find('strong').html('3m');
			$(covL + ' .message').last().after($el);
			$el.css({
				'height' : 0,
			});
			TweenLite.to($el, 0.5, {
				'delay' : 0.5,
				'height' : 32,
			});
		}
		if(coverAmount == 30) {
			$(covL + ' .message').last().find('strong').html('4m');
		}
		if(coverAmount == 50) {
			// update 2nd message
			$(covL + ' .message').last().find('strong').html('5m');
		}
		if(coverAmount == 60) {
			// update 2nd message
			$(covL + ' .message').last().find('strong').html('6m');
		}
		if(coverAmount == 70) {
			// update 2nd message
			$(covL + ' .message').last().find('strong').html('7m');
		}
		if(coverAmount == 80) {
			// update 2nd message
			$(covL + ' .message').last().find('strong').html('8m');
		}
		if(coverAmount == 90) {
			// update 2nd message
			$(covL + ' .message').last().find('strong').html('9m');
			// remove 3rd message
			$(covL + ' .message').eq(2).remove();
		}
		if(coverAmount == 100 && $(covL + ' .message').length < 3) {
			// update 2nd message
			$(covL + ' .message').last().find('strong').html('10m');
			// show 3rd message
			$el = $(covL + ' .message').eq(0).clone();
			$el.find('span').html(MessageFinal);
			$(covL + ' .message').last().after($el);
			$el.css({
				'height' : 0,
			});
			TweenLite.to($el, 0.5, {
				'delay' : 0.5,
				'height' : 48,
			});
		}
	}

	// animate size & position
	var s = 0.25;
	var Utop = marginTop;
	var Ltop = Math.ceil($(window).height() - (coverSize*2) - marginBottom); // ceil needed to prevent 1px gaps
	if(coverPos == 'top') {
		Ltop = Utop;
	} else if(coverPos == 'bottom') {
		Utop = Ltop;
	}
	$(covU + ', ' + covL).css('position',''); // shouldn't be necessary, but jqueiryui-draggable adds position:relative under certain unknown circumstances.
	TweenLite.to(covU, s, {
		'height' : 				coverSize,
		'top' : 				Utop,
		onComplete : 			setDragBounds()
	});
	if(coverPos != 'bottom') {
		// add a litte wobble
		TweenLite.to(covUB, s*0.5, {
			ease : 				Circ.easeOut,
			'top' : 			(Utop - (coverSize/8)) * -1
		});
		TweenLite.to(covUB, s*3.5, {
			delay : 			s*0.5,
			ease : 				Elastic.easeOut.config(1, 0.3),
			'top' : 			Utop * -1
		});
		TweenLite.to('.blurred .junkfood_app_nav', s*0.5, {
			ease : 				Circ.easeOut,
			'top' : 			(coverSize/8) * -1
		});
		TweenLite.to('.blurred .junkfood_app_nav', s*3.5, {
			delay : 			s*0.5,
			ease : 				Elastic.easeOut.config(1, 0.3),
			'top' : 			0
		});
	} else {
		TweenLite.to(covUB, s*4, {
			ease : 				Elastic.easeOut.config(1, 0.3),
			'top' : 			Utop * -1
		});
	}
	TweenLite.to(covL, s, {
		'height' : 				coverSize,
		'top' : 				Ltop + coverSize
	});
	TweenLite.to(covLB, s*4, {
		ease : 				Elastic.easeOut.config(1, 0.3),
		'top' : 			(Ltop + coverSize) * -1
	});
}

function startCountdown() {
	$(covU).data('moveable',false);
	$(covL).data('moveable',false);
	var s = 0;
	TweenMax.to('#countdown_pie div', 1.5, {
		delay : 1,
		ease : Elastic.easeOut.config(0.75, 0.4),
		'transform' : 'scale(0.6)',
	});
	s = 2;
	var tl1 = new TimelineMax({
		delay : 2.5,
		repeat : 5
	});
	tl1
		.to('#countdown_pie div', s, {
			delay : s/2,
			ease : Linear.easeNone,
			'transform' : 'scale(0.8)'
		})
		.to('#countdown_pie div', s, {
			delay : s/2,
			ease : Linear.easeNone,
			'transform' : 'scale(0.6)'
		})
	;
	TweenLite.to('#countdown_pie div', 0.5, {
		delay : 1,
		'opacity' : 1
	});
	TweenLite.to(covL, 1, {
		'opacity' : 1
	});
	$(covL + ' .message').eq(2).remove();
	$(covL + ' .message').eq(1).remove();
	$(covL + ' .message span').eq(0).html(MessageCountdown1);
	$el = $(covL + ' .message').eq(0).clone();
	$el.find('span').html(MessageCountdown2);
	$(covL + ' .message').last().after($el);
	TweenLite.to($(covL + ' .message').eq(0), 0.5, {
		'height' : 48,
		'marginTop' : 8
	});
	TweenLite.to($(covL + ' .message').eq(1), 0.5, {
		'height' : 32,
		'marginTop' : 8
	});
	/* 2πr ≈ 283 */
	s = 30;
	TweenLite.to('#countdown_pie_inner', s, {
		delay : 1,
		'stroke-dasharray' : '283 0',
		onComplete : function() {
			countDown = false;
			$(covU).data('moveable',true);
			$(covL).data('moveable',true);
			coverAmount = 0;
			setcoverSize();
			tl1.clear();
			TweenMax.to('#countdown_pie div', 0.25, {
				'transform' : 'scale(0.1)',
				'opacity' : 0
			});
			TweenLite.delayedCall(1, function(){
				$('#countdown_pie_inner').css({
					'stroke-dasharray' : ''
				})
				$(covL + ' .message').eq(0).remove();
				animateToSplit('top');
			});
		}
	});
}

function updateCoverAmount(code) {
	if(code == 188) {
		// ,< pressed
		coverAmount -= 10;
		coverAmount = coverAmount < 0 ? 0 : coverAmount;
		setcoverSize();
	} else if(code == 190) {
		// .> pressed
		coverAmount += 10;
		coverAmount = coverAmount > 100 ? 100 : coverAmount;
		setcoverSize();
	}
}

function coverDrag($el) {
	var top = parseInt($el.css('top'));
	var other = '';
	$el.find('.blurred').css('top',top*-1);
	if(coverPos != 'split') {
		// drag other cover too
		if(covU.indexOf($el.attr('id')) > -1) {
			top += coverSize;
			other = covL;
		} else {
			top -= coverSize;
			other = covU;
		}
		$(other).css('top',top);
		$(other).find('.blurred').css('top',top*-1);
	}
}

function setDragBounds() {
	var dragBoundsU = [
		8,
		marginTop,
		8,
		$(covL).offset().top - coverSize
	];
	var dragBoundsL = [
		8 ,$(covU).offset().top + coverSize,
		8,
		$(window).height() - marginBottom - coverSize
	];
	$(covU).draggable('option','containment',dragBoundsU);
	$(covL).draggable('option','containment',dragBoundsL);
}

function joinCovers() {
	if(coverPos = 'split') {
		var distance = $(covU).offset().top + coverSize - $(covL).offset().top;
		if(distance < 2 && distance > -2) {
			if($(covU).offset().top > $(window).height()/2) {
				coverPos = 'top';
				$(covU + ', ' + covL).removeClass('cover_pos_split').addClass('cover_pos_top');
			} else {
				coverPos = 'bottom';
				$(covU + ', ' + covL).removeClass('cover_pos_split').addClass('cover_pos_bottom');
			}
		}
	}
}

function bindEvents() {
	$('#fakeKeyboard').click(function() {
		// prevents hiding of onscreen keyboard
	});

	$('body').scroll(function() {
		var y = $(this).scrollTop() * -1;
		$('.blurred').css('background-position-y',y);
	});

	$('body').keyup(function(event) {
		var code = event.keyCode || event.which;
		updateCoverAmount(code);
	});

	$('#time_back').click(function() {
		if (screenfull.enabled && !screenfull.isFullscreen) {
			screenfull.request($('body')[0]);
		}
		updateCoverAmount(188); // down
	});

	$('#time_next').click(function(){
		if (screenfull.enabled && !screenfull.isFullscreen) {
			screenfull.request($('body')[0]);
		}
		updateCoverAmount(190); // up
	})

	$('#bottom_navigationbar').click(function(){
		if (screenfull.isFullscreen) {
			screenfull.exit();
		}
	})

	$('#cover_upper, #cover_lower').click(function() {
		pickAnimation($(this));
	});

	$('#cover_upper, #cover_lower').draggable({
		disabled: true,
		distance: 2,
		drag: function( event, ui ) {
			coverDrag($(this));
		},
		stop: function( event, ui ) {
			setDragBounds();
			joinCovers();
		}
	});

	$('#button_break').click(function() {
		if(!countDown) {
			countDown = true;
			setcoverSize();
			startCountdown();
		}
	});

	$('#button_calls, #button_wellness').click(function() {
		event.stopPropagation();
	});

}

// elements to be animated
var covU = '#cover_upper'; // border-radius, border, height, top
var covL = '#cover_lower'; // border-radius, border, height, top
var covUB = covU + ' .blurred'; // top, height
var covLB = covL + ' .blurred'; // top, height

// constants
var coverMax = 0.33; // ratio of window height = 1
var coverMin = 48; // minimum pixel height
var radMax = 16; // border-radius
var marginTop = 32;
var marginBottom = 56;
var countDown = false;
var MessageIntro = 'You flagged this app for less use <i class="emoji">👍</i>';
var MessageUsage = 'You\'ve used this app <strong></strong> <i class="emoji">🤔</i>';
var MessageFinal = 'Take a 5 min break to return screen to normal<br>Try an option above, or lock your phone <i class="emoji">💪</i>'
var MessageCountdown1 = 'You\'ll get 5 mins of unblocked use after this<br>break. Meanwhile, enjoy a few deep breaths!';
var MessageCountdown2 = 'This message will self-destruct in 30 secs <i class="emoji">🔥</i>';

// variables
var coverPos = 'split';
var coverAmount = -10; // ratio of coverMax = 100
var coverSize = 0;
$(covU).data('moveable',false);
$(covL).data('moveable',false);

bindEvents();

/* TweenMax reference
	var tl1 = new TimelineLite();
	tl1
		.add(function(){
		})
		.to(card, 0, {
			'borderRadius' : 	CSSVal(card,state,'borderRadius'),
		})
		.set(wipe,{
			clearProps : 'all'
		})
	;
*/
