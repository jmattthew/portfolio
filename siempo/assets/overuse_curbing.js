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

function setcoverSize(doFull) {
	console.log('coverAmount: ' + coverAmount);
	// unique actions for each coverAmount
	if(coverAmount == 101) {
		coverSize = ($(window).height() - marginTop - marginBottom)/2;
		$(covU + ',' + covL).css({
			'opacity' : 1
		});
		animateToTop();
	} else {
		coverSize = ($(window).height() - marginTop - marginBottom) * (coverMax) * (coverAmount / 100);
		coverSize = coverSize < coverMin ? coverMin : coverSize;
	}
	if(coverAmount == 0) {
		animateToSplit('top');
	}
	if(coverAmount < 10) {
		// hide lower cover
		$(covL).data('moveable',false);
		TweenLite.to(covL, 1, {
			'opacity' : 0
		});
	}
	if(coverAmount == 10) {
		// show lower cover and first message
		$(covL).data('moveable',true);
		TweenLite.to(covL, 1, {
			delay : 0.25,
			'opacity' : 1
		});
		$(covL + ' .message span').html(MessageIntro);
		TweenLite.to($(covL + ' .message'), 0.5, {
			delay : 1,
			'height' : 32,
			'marginTop' : 8
		});
		$(covL).draggable('option','containment',[8,$(covU).offset().top + coverSize,8,$(window).height() - 56 - coverSize]);
	}
	if(coverAmount < 20) {
		// hide upper cover
		$(covU).data('moveable',false);
		TweenLite.to(covU, 1, {
			'opacity' : 0
		});
	}
	if(coverAmount == 20) {
		// show upper cover
		$(covU).data('moveable',true);
		TweenLite.to(covU, 1, {
			'opacity' : 1
		});
		$(covU).draggable('option','containment',[8,32,8,$(covL).offset().top - coverSize]);
	}
	if(coverAmount == 30) {
		// remove 2nd message
		$(covL + ' .message').eq(1).remove();
	}
	if(coverAmount == 40 && $(covL + ' .message').length < 2) {
		// show second message
		$el = $(covL + ' .message').eq(0).clone();
		$el.find('span').html(MessageUsage);
		$el.find('strong').html('7h 00m');
		$(covL + ' .message').last().after($el);
		$el.css({
			'height' : 0,
			'marginTop' : 40
		});
		TweenLite.to($el, 0.5, {
			'delay' : 0.5,
			'height' : 32,
			'marginTop' : 8
		});
		// compensate for small screens
		TweenLite.to($(message_container), 0.5, {
			delay : 0.5,
			'top' : coverSize - 88
		});
	}
	if(coverAmount == 50) {
		// update 2nd message
		$(covL + ' .message').last().find('strong').html('7h 10m');
		TweenLite.to($(message_container), 0.5, {
			delay : 0.5,
			'top' : ''
		});
	}
	if(coverAmount == 60) {
		// update 2nd message
		$(covL + ' .message').last().find('strong').html('7h 20m');
	}
	if(coverAmount == 70) {
		// update 2nd message
		$(covL + ' .message').last().find('strong').html('7h 30m');
	}
	if(coverAmount == 80) {
		// update 2nd message
		$(covL + ' .message').last().find('strong').html('7h 40m');
	}
	if(coverAmount == 90) {
		// update 2nd message
		$(covL + ' .message').last().find('strong').html('7h 50m');
		// remove 3rd message
		$(covL + ' .message').eq(2).remove();
	}
	if(coverAmount == 100 && $(covL + ' .message').length < 3) {
		// update 2nd message
		$(covL + ' .message').last().find('strong').html('8h 00m');
		// show 3rd message
		$el = $(covL + ' .message').eq(0).clone();
		$el.find('span').html(MessageFinal);
		$(covL + ' .message').last().after($el);
		$el.css({
			'height' : 0,
			'marginTop' : 40
		});
		TweenLite.to($el, 0.5, {
			'delay' : 0.5,
			'height' : 48,
			'marginTop' : 8
		});
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
	TweenLite.to(covU, s, {
		'height' : 			coverSize,
		'top' : 			Utop
	});
	if(coverPos != 'bottom') {
		// add a litte wobble
		console.log((Utop + coverSize) * -1);
		TweenLite.to(covUB, s*0.5, {
			ease : 				Circ.easeOut,
			'top' : 			(Utop - (coverSize/8)) * -1
		});
		TweenLite.to(covUB, s*3.5, {
			delay : 			s*0.5,
			ease : 				Elastic.easeOut.config(1, 0.3),
			'top' : 			Utop * -1
		});
	} else {
		TweenLite.to(covUB, s*4, {
			ease : 				Elastic.easeOut.config(1, 0.3),
			'top' : 			Utop * -1
		});
	}
	TweenLite.to(covL, s, {
		'height' : 			coverSize,
		'top' : 			Ltop + coverSize
	});
	TweenLite.to(covLB, s*4, {
		ease : 				Elastic.easeOut.config(1, 0.3),
		'top' : 			(Ltop + coverSize) * -1
	});
}

function startCountdown() {
	$(covU).data('moveable',false);
	$(covL).data('moveable',false);
	TweenLite.to('#countdown_pie svg', 1.5, {
		delay : 1,
		ease : Elastic.easeOut.config(0.75, 0.4),
		'transform' : 'scale(1) rotate(-90deg)',
	});
	TweenLite.to('#countdown_pie svg', 0.5, {
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
	TweenLite.to('#countdown_pie_inner', 30, {
		delay : 1,
		'stroke-dasharray' : '283 0',
		onComplete : function() {
			coverAmount = 0;
			setcoverSize();
			TweenLite.delayedCall(1, function(){
				$('#countdown_pie svg').css({
					'transform' : 'scale(0.1) rotate(-90deg)',
					'opacity' : 0
				});
				$(covL + ' .message').eq(1).remove();
				animateToSplit('top');
			})
		}
	});
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
	});

	$('#time_back').click(function() {
		if (screenfull.enabled && !screenfull.isFullscreen) {
			screenfull.request($('body')[0]);
		}
		coverAmount -= 10;
		coverAmount = coverAmount < 0 ? 0 : coverAmount;
		setcoverSize();
	});

	$('#time_next').click(function(){
		if (screenfull.enabled && !screenfull.isFullscreen) {
			screenfull.request($('body')[0]);
		}
		coverAmount += 10;
		coverAmount = coverAmount > 100 ? 100 : coverAmount;
		setcoverSize();
	})

	$('#bottom_navigationbar').click(function(){
		if (screenfull.isFullscreen) {
			screenfull.exit();
		}
	})

	$('#cover_upper, #cover_lower').click(function() {
		if($(this).data('moveable')) {
			if(coverPos == 'top') {
				animateToSplit('top');
			} else if(coverPos == 'bottom') {
				animateToSplit('bottom');
			} else if(coverPos == 'split') {
				if($(this).attr('id') == 'cover_upper') {
					animateToBottom();
				} else {
					animateToTop();
				}
			}
		}
	});

	$('#cover_upper').draggable({
		drag: function( event, ui ) {
			var top = parseInt($(this).css('top'));
			$(this).find('.blurred').css('top',top*-1);
			if(coverPos != 'split') {
				top += coverSize;
				$(covL).css('top',top);
				$(covL).find('.blurred').css('top',top*-1);
			}
		},
		stop: function( event, ui ) {
			$(covL).draggable('option','containment',[8,$('#cover_upper').offset().top + coverSize,8,$(window).height() - 56 - coverSize]);
			coverPos = 'split';
		}
	});

	$('#cover_lower').draggable({
		drag: function( event, ui ) {
			var top = parseInt($(this).css('top'));
			$(this).find('.blurred').css('top',top*-1);
			if(coverPos != 'split') {
				top -= coverSize;
				$(covU).css('top',top);
				$(covU).find('.blurred').css('top',top*-1);
			}
		},
		stop: function( event, ui ) {
			$(covU).draggable('option','containment',[8,32,8,$('#cover_lower').offset().top - coverSize]);
			coverPos = 'split';
		}
	});

	$('#buy_time').click(function() {
		if(coverAmount < 101) {
			coverAmount = 101;
			setcoverSize();
			startCountdown();
		}
	});

}

// elements to be animated
var covU = '#cover_upper'; // border-radius, border, height, top
var covL = '#cover_lower'; // border-radius, border, height, top
var covUB = '#cover_upper .blurred'; // top, height
var covLB = '#cover_lower .blurred'; // top, height

// constants
var coverMax = 0.33; // ratio of window height = 1
var coverMin = 48; // minimum pixel height
var radMax = 16; // border-radius
var marginTop = 32;
var marginBottom = 56;
var MessageIntro = 'We\'ve got your back :)';
var MessageUsage = 'You\'ve used you phone <strong></strong> today <i class="emoji">🤔</i>';
var MessageFinal = 'Lock your phone to meet your goal<br>These messages disappear in 8 hours <i class="emoji">🌞</i>'
var MessageCountdown1 = 'Enjoy 5 mins of unblocked viewing after this break<br>A few deep breaths will pass the time!';
var MessageCountdown2 = 'This cover will self-destruct in 30 seconds <i class="emoji">🔥</i>';

// variables
var coverPos = 'split';
var coverAmount = 0; // ratio of coverMax = 100
var coverSize = 0;
$(covU).data('moveable',false);
$(covL).data('moveable',false);

bindEvents();

/* TweenMax reference
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
