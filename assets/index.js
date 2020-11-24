/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* GLOBAL FUNCTIONS */

jQuery.expr.filters.offscreen = function(el) {
	// extends jQuery to select for offscreen items
	var rect = el.getBoundingClientRect();
	return (
		(rect.x + rect.width) < 0
		|| (rect.y + rect.height) < 0
		|| (rect.x > window.innerWidth || rect.y > window.innerHeight)
	);
};

function makeSVGInline() {
	var requests = [];

	$('.svg').each(function(){
		var imgSrc = $(this).attr('src');
		var request = $.ajax({
			url: imgSrc,
			dataType: 'html'
		})
		.done(function(data) {
			var $svg, $img, imgAlt;

			$svg = $(data);
			$svg.css('fill','');
			$img = $('[src*="'+this.url+'"]');
			imgAlt = $img.attr('alt');
			$svg.attr('alt',imgAlt);
			$img.replaceWith($svg);
		})
		requests.push(request);
	});
	$.when.apply($, requests).then(function() {
		// success
		navigateToHash();
	}, function() {
		// failure
		navigateToHash();
	});
}

function navigateToHash() {
	var h = location.hash;
	var validProject = false;

	if(h.length>0) {
		h = h.substring(1,h.length);
		console.log(h);
		if(h == 'contact' || h == 'about') {
			hideStackButton();
			collapseNavigation();
			doNavTransition(h);
			page = h;
			sendGaEvent('hash','navigation','#'+h);
		} else {
			if(h == 'Sense') {
				$activeProject = $('#project_Sens');
				validProject = true;
			} else if(h == 'Clover') {
				$activeProject = $('#project_ClVr');
				validProject = true;
			} else if(h == 'Siempo') {
				$activeProject = $('#project_SiPo');
				validProject = true;
			} else if(h == 'Cardpool') {
				$activeProject = $('#project_CaPo');
				validProject = true;
			} else if(h == 'CouchSurfing') {
				$activeProject = $('#project_CoSu');
				validProject = true;
			} else if(h == 'Rotten_Tomatoes') {
				$activeProject = $('#project_RoTo');
				validProject = true;
			} else if(h == 'Font_Finder') {
				$activeProject = $('#project_FoFi');
				validProject = true;
			} else if(h == 'Tactile_Generator') {
				$activeProject = $('#project_TaGe');
				validProject = true;
			}
			if(validProject) {
				skill = 'skill_strategy';
				revealDetails();
				hideStackButton();
				page = 'details';
				sendGaEvent('hash','project','#'+h);
			} else {
				window.history.replaceState(null, null, 'index.html');
			}
		}
	}
}

function applyBlur() {
	var x = parseInt(blur.x);
	var y = parseInt(blur.y);
	$('#blur').children().eq(0).attr('stdDeviation', x + ',' + y);
}

/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* SKILL STACK FUNCTIONS */

function showStack() {
	var thisDelay, newTop, s;

	s = 1.25;
	$('#skill_stack').removeClass('start');
	if(isFirefox) {
		// Firefox remembers the last scroll position on refresh
		$('#home .content').scrollTop(0);
	}
	TweenMax.to('#home_start', s/2.5, {
		'opacity' : 0,
		onComplete : function() {
			$('#home_start').css('display','none');
		}
	});
	newTop = $('.skill').eq(0).outerHeight() * 4;
	TweenMax.set('.skill', { y:newTop });
	for(var i=0, il=$('.skill').length; i<il; i++) {
		var $el = $('.skill').eq(i);
		thisDelay = 0.3 + (i * 0.5 / (i+1));
		TweenMax.to($el, s, {
			delay : thisDelay,
			ease : Elastic.easeOut.config(.4, 0.4),
			'opacity' : 1,
			y : 0
		});
	}

	if(isChrome) {
		// Firefox and Safari render this too slowly
		$('.skill:first-child').addClass('blur');
		blur = { x:0, y:0 };
		TweenMax.to(blur, s/4, {
			x : 0,
			y : 500,
			onUpdate : applyBlur,
			onComplete : function(){
				$('.skill:first-child').removeClass('blur');
			}
		});
	} else if(!isFirefox) {
		// Firefox renders this too slowly
		$('.skill:first-child').css('filter','url(#nonChromeBlurY)');
		setTimeout(function() {
			$('.skill:first-child').css('filter','');
		},s/2*1000);
	}
	thisDelay += 1; // length of slide-in
	TweenMax.delayedCall(thisDelay, function(){
		$('.skill').addClass('hoverable');
	});
}

function hideStack() {
	var thisDelay, x, ease;

	$('.skill').removeClass('hoverable');
	x = $('.skill').eq(0).innerWidth();
	x += parseInt($('.skill').eq(0).css('margin-left'));
	x *= -1;
	for(var i=0, il=$('.skill:not(:offscreen)').length; i<il; i++) {
		var $el = $('.skill:not(:offscreen)').eq(i);
		thisDelay = i * 0.1;
		TweenMax.to($el, 1.75, {
			delay : thisDelay,
			'opacity' : 0,
			clearProps : 'x'
		});
		TweenMax.to($el, 1, {
			delay : thisDelay,
			ease : Back.easeIn.config(1.4),
			x : x
		});
	}
	thisDelay += 1; // length of fadeout
	TweenMax.delayedCall(thisDelay, function(){
		$('#skill_stack').addClass('start');
		$('#home_start').css('display','');
		$('.skill').attr('style','');
	});
	TweenMax.to('#home_start', 0.5, {
		delay : thisDelay,
		'opacity' : 1
	});
}

function highlightSkill($skill) {
	var twinSkills, offsetY;

	twinSkills = $('.skill').clone(true);
	if($skill.is($('.skill').eq(0))) {
		// when topmost skill clicked, we prepend
		// skills because scroll will animate down
		if($('#home .content').scrollTop()==0) {
			// ensures the scroll maintaining position after prepend
			$('#home .content').scrollTop(1);
		}
		offsetY = $('#skill_stack').height();
		offsetY += $('#home .content').scrollTop();
		if(!narrowScreen) {
			// I don't know why mobile behaves differently
			offsetY += parseInt($('#skill_stack').css('padding-top'));
		}
		$('#skill_stack').prepend(twinSkills);
		// ensures the scroll maintaining position after prepend
		$('#home .content').scrollTop(offsetY);
	} else {
		$('#skill_stack').append(twinSkills);
	}
	$('#skill_stack').addClass('selected');
	$('.skill').removeClass('hoverable');
	$skill.addClass('selected');
	// offsetY ensuring highlighted skill
	// is under the navigation by pleasing amount
	offsetY = $('#navigation').outerHeight(true);
	if(narrowScreen) {
		offsetY	-= parseInt($('.skill').eq(0).css('marginLeft'));
	}
	highlightDuration = $('.skill:not(:offscreen)').index($skill);
	highlightDuration = (highlightDuration + 2) * 0.15;
	TweenMax.to('#home .content', highlightDuration, {
		ease : Power2.easeOut,
		scrollTo: {
			y : $skill,
			offsetY : offsetY
		},
		onComplete : function() {
			$('.skill:offscreen').remove();
			TweenMax.set('#home .content', {
				scrollTo: {
					y : $skill,
					offsetY : offsetY
				}
			});
			setTimeout(function() {
				// delay needed because oncomplete
				// fires before last of scroll animation
				// executes, which would hide projects
				// https://greensock.com/forums/topic/8337-oncomplete-is-firing-before-the-last-animation-frame/
				lastPage = page;
				page = 'projects';
			},100);
		}
	});
}

function glowSkillOnHover(event,$skill,show) {
	var xRatio, yRatio, backgroundImage;

	xRatio = parseInt((event.pageX - $skill.offset().left) / $skill.innerWidth() * 100);
	yRatio = parseInt((event.pageY - $skill.offset().top) / $skill.innerHeight() * 100);
	backgroundImage = 'radial-gradient(circle 200px at ' +
		xRatio + '% ' + yRatio + '%,' +
		'rgba(255,255,255,0.5) 25%,' +
		'rgba(255,255,255,0.0) 100%)';
	$skill.find('div').css('background-image',backgroundImage);
}

/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* PROJECT LIST FUNCTIONS */

function filterProjects($skill) {
	var id;

	$('.project').css('display','none');
	$('.tab').css('display','');
	$('.tab').removeClass('tab_1 tab_2 tab_3 tab_4 hoverable selected')
	// hide tabs not relevant to selected skill
	// hide all projects except 1st for this skill
	id = $skill.attr('id');
	if(id == 'skill_strategy') {
		$('#tab_Sens').addClass('tab_1 selected');
		$('#tab_ClVr').addClass('tab_2 hoverable');
		$('#tab_SiPo').addClass('tab_3 hoverable');
		$('#tab_CaPo').addClass('tab_4 hoverable');
		$('#tab_CoSu').css('display','none');
		$('#tab_RoTo').css('display','none');
		$('#tab_FoFi').css('display','none');
		$('#tab_TaGe').css('display','none');
		$activeProject = $('#project_Sens');
	} else if(id == 'skill_research') {
		$('#tab_ClVr').addClass('tab_1 selected');
		$('#tab_SiPo').addClass('tab_2 hoverable');
		$('#tab_CaPo').addClass('tab_3 hoverable');
		$('#tab_RoTo').addClass('tab_4 hoverable');
		$('#tab_Sens').css('display','none');
		$('#tab_CoSu').css('display','none');
		$('#tab_FoFi').css('display','none');
		$('#tab_TaGe').css('display','none');
		$activeProject = $('#project_ClVr');
	} else if(id == 'skill_interaction') {
		$('#tab_SiPo').addClass('tab_1 selected');
		$('#tab_CaPo').addClass('tab_2 hoverable');
		$('#tab_FoFi').addClass('tab_3 hoverable');
		$('#tab_TaGe').addClass('tab_4 hoverable');
		$('#tab_Sens').css('display','none');
		$('#tab_ClVr').css('display','none');
		$('#tab_CoSu').css('display','none');
		$('#tab_RoTo').css('display','none');
		$activeProject = $('#project_SiPo');
	} else if(id == 'skill_visual') {
		$('#tab_Sens').addClass('tab_1 selected');
		$('#tab_SiPo').addClass('tab_2 hoverable');
		$('#tab_CaPo').addClass('tab_3 hoverable');
		$('#tab_FoFi').addClass('tab_4 hoverable');
		$('#tab_ClVr').css('display','none');
		$('#tab_CoSu').css('display','none');
		$('#tab_RoTo').css('display','none');
		$('#tab_TaGe').css('display','none');
		$activeProject = $('#project_Sens');
	} else if(id == 'skill_prototypes') {
		$('#tab_SiPo').addClass('tab_1 selected');
		$('#tab_RoTo').addClass('tab_2 hoverable');
		$('#tab_FoFi').addClass('tab_3 hoverable');
		$('#tab_TaGe').addClass('tab_4 hoverable');
		$('#tab_Sens').css('display','none');
		$('#tab_ClVr').css('display','none');
		$('#tab_CaPo').css('display','none');
		$('#tab_CoSu').css('display','none');
		$activeProject = $('#project_SiPo');
	} else if(id == 'skill_artwork') {
		//
	}
	$activeProject.css('display','');
	/*
	Menu tree:
		skill_strategy
			Sens
			Clover
			Siempo
			Cardpool
		skill_research
			Clover
			Siempo
			Cardpool
			Rotten Tomatoes
		skill_interaction
			Siempo
			Cardpool
			Font finder
			Tactile Generator
		skill_visual
			Sense
			Siempo
			Cardpool
			Font finder
		skill_prototypes
			Siempo
			Rotten Tomatoes
			Font finder
			Tactile Generator
		skill_artwork
	*/
}

function revealProjects() {
	var s, conf, marginBottom, marginRight, delay, animProperty, animValue, blurX, blurY;

	delay = highlightDuration/2;
	s = 1.5;
	conf = 2;

	if(narrowScreen) {
		animProperty = 'marginBottom';
		blurX = 0;
		blurY = 50;
		animValue = $('.tab').eq(0).height() * -1;
	} else {
		animProperty = 'marginRight';
		blurX = 200;
		blurY = 0;
		animValue = $('.tab').eq(0).width() * -1;
	}
	TweenMax.from('.tab_1', s/2, {
		delay : delay + (s*(5/16)),
		ease : Back.easeOut.config(conf),
		[animProperty] : animValue,
		clearProps : animProperty
	});
	TweenMax.from('.tab_2', s/2, {
		delay : delay + (s*(4/16)),
		ease : Back.easeOut.config(conf),
		[animProperty] : animValue,
		clearProps : animProperty
	});
	TweenMax.from('.tab_3', s/2, {
		delay : delay + (s*(3/16)),
		ease : Back.easeOut.config(conf),
		[animProperty] : animValue,
		clearProps : animProperty
	});
	TweenMax.from('.tab_4', s/2, {
		delay : delay + (s*(2/16)),
		ease : Back.easeOut.config(conf),
		[animProperty] : animValue,
		clearProps : animProperty
	});
	$('#projects').css('display','block');
	blur = { x:0, y:0 };
	if(isChrome) {
		// Firefox renders too slowly and Safari won't render the blur for unknown reasons
		$('#projects').addClass('blur');
		TweenMax.from(blur, s*0.4, {
			x : blurX,
			y : blurY,
			delay : delay,
			ease : Expo.easeOut,
			onUpdate : applyBlur,
			onComplete : function(){
				$('#projects').removeClass('blur');
			}
		});
	} else if(!isFirefox) {
		// Firefox renders this too slowly
		if(narrowScreen) {
			$activeProject.css('filter','url(#nonChromeBlurY)');
		} else {
			$activeProject.css('filter','url(#nonChromeBlurX)');
		}
		setTimeout(function() {
			$activeProject.css('filter','');
		},(delay+(s*0.4))*1000);
	}
	TweenMax.to('#projects', s/3, {
		delay : delay,
		opacity : 1
	});
	if(narrowScreen) {
		animProperty = 'marginBottom';
		animValue = $('#projects').height() * -1.25;
	} else {
		animProperty = 'x';
		animValue = $('#projects').width() * 1.25;
	}
	TweenMax.from('#projects', s, {
		delay : delay,
		ease : Expo.easeOut,
		[animProperty] : animValue,
		clearProps : animProperty
	});
}

function hideProjects(scrollToTop) {
	var s = 0.5;

	$('#skill_stack').removeClass('selected');
	$('.skill').removeClass('selected');
	$('.skill').addClass('hoverable');
	TweenMax.to('#projects', s, {
		opacity : 0,
		onComplete : function() {
			$('#projects').css('display','none');
		}
	});
	if(scrollToTop) {
		TweenMax.to('#home .content', 0.5, {
			ease : Back.easeOut.config(0.25),
			scrollTo: 0
		});
	}
}

function switchProject(tab) {
	var s, suffix;

	$('.tab').removeClass('selected');
	$('.tab').addClass('hoverable');
	$(tab).removeClass('hoverable');
	$(tab).addClass('selected');
	suffix = $(tab).attr('id');
	suffix = suffix.substring(suffix.indexOf('_'),suffix.length);
	$newProject = $('#project'+suffix);
	if(!$newProject.is($activeProject)) {
		$('.project').css('display','none');
		$activeProject.css({
			'display' : '',
			'position' : 'absolute',
			'bottom' : 0,
			'right' : 0,
		});
		$newProject.css({
			'display' : '',
			'opacity' : 0,
			'z-index' : 1
		});
		$activeProject.find('h3, .description').addClass('blur');
		$newProject.find('h3, .description').addClass('blur');
		s = 0.5;
		if(narrowScreen) {
			TweenMax.to([$activeProject, $newProject], s*0.5, {
				ease : Power2.easeOut,
				y : -20
			});
			TweenMax.to([$activeProject, $newProject], s*0.5, {
				delay : s*0.5,
				ease : Power2.easeIn,
				y : 0
			});
		} else {
			TweenMax.to($activeProject.find('.button'), s*0.5, {
				ease : Back.easeOut.config(1.7),
				x : -10
			});
			TweenMax.to($activeProject.find('.button'), s*0.5, {
				delay : s*0.5,
				ease : Back.easeOut.config(1.7),
				x : 0
			});
		}
		blur = { x:0, y:0 };
		TweenMax.to(blur, s*0.4, {
			delay : s*0.25,
			x : 20,
			y : 0,
			onUpdate : applyBlur
		});
		// TweenMax.to(blur, s*0.4, {
		// 	delay : s*0.65,
		// 	x : 0,
		// 	y : 0,
		// 	onUpdate : applyBlur,
		// });
		TweenMax.to($newProject, s*0.75, {
			delay : s*0.5,
			'opacity' : 1,
			onComplete : function(){
				$activeProject.find('h3, .description').removeClass('blur');
				$activeProject.css({
					'display' : 'none',
					'position' : '',
					'bottom' : '',
					'right' : '',
				});
				$newProject.css({
					'right' : '',
					'opacity' : '',
					'z-index' : ''
				});
				$newProject.find('h3, .description').removeClass('blur');
				$activeProject = $newProject;
			}
		});
	}
}

/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* DETAILS PAGE FUNCTIONS */

function revealDetails() {
	var id, detailSkill, $scroller, s;

	id = $activeProject.attr('id');
	id = id.substring(id.indexOf('_')+1,id.length);
	$('body').addClass('viewit viewit_' + id);
	id = '#details_' + id;
	$detailSkill = $(id).find('.'+skill);
	$scroller = $(id).find('.scroller');

	s = 0.5;
	$(id).css('display','block');
	TweenMax.to(id, s, {
		delay : s*0.75,
		opacity : 1
	});
	showDetailsCloseButton(s);
	resizeFloatTargets($scroller);
	loadIframes($scroller);
	$scroller.data('stopAnims',true);
	// Firefox remembers the last scroll position on refresh
	$scroller.scrollTop(0);
	// GSAP does say you can simply pass
	// the element to be scroll to, but
	// that only works in Chrome
	TweenMax.to($scroller, s*2.25, {
		ease : Power2.easeOut,
		scrollTo: {
			y : $detailSkill.offset().top - $scroller.offset().top
		},
	});
	TweenMax.delayedCall(s*2.25, function() {
		// we need to use delayedCall vs. onComplete
		// because any scrolling will cancel the scrollTo
		$scroller.data('stopAnims',false);
	})
}

function showDetailsCloseButton(s) {
	$('#back_to_projects').css('display','block');
	TweenMax.to('#back_to_projects', s, {
		delay : s*0.75,
		opacity : 1
	});
}

function loadIframes($scroller) {
	$scroller.closest('.frame').find('iframe').each(function() {
		$(this).attr('src',$(this).attr('delayedSrc'));
	});
}

function hideDetails() {
	var s, id, margin;

	id = $activeProject.attr('id');
	id = id.substring(id.indexOf('_')+1,id.length);
	id = '#details_' + id;

	$('body').removeClass();
	s = 0.5;
	TweenMax.to('#back_to_projects', s/2, {
		opacity : 0,
		clearProps : 'opacity',
		onComplete : function() {
			$('#back_to_projects').css('display','');
		}
	});
	TweenMax.to(id, s, {
		opacity : 0,
		clearProps : 'opacity',
		onComplete : function() {
			// scrollTop must preceed display none
			var $scroller = $(id).find('.scroller');
			$scroller.data('stopAnims',true);
			$scroller.scrollTop(0);
			window.setTimeout(function() {
				$scroller.data('stopAnims',false);
			},100);
			$('.details').css('display','');
		}
	});
	margin = $('#home').css('padding-top');
	TweenMax.from('#skill_stack', s, {
		ease : Back.easeOut.config(4),
		delay : s,
		'margin' : margin,
		clearProps : 'margin'
	});
	TweenMax.from('#home', s, {
		ease : Back.easeOut.config(4),
		delay : s,
		padding : 0,
		clearProps : 'padding'
	});
}

function getFloatBoxSpeed($scroller) {
	clearTimeout($.data($scroller, 'scrollTimer'));
	$.data($scroller, 'scrollTimer', setTimeout(function() {
		// execute after scrolling stops
		// scrollSpeedArray[0] is the last avg. speed
		scrollSpeedArray = [scrollSpeedArray[0]];
	}, 500));
	scrollSpeedArray.push($scroller.scrollTop());
	var scrollSum = 0;
	for(i=2,il=scrollSpeedArray.length;i<il;i++) {
		scrollSum = scrollSpeedArray[i] - scrollSpeedArray[i-1];
	}
	scrollSpeedArray[0] = scrollSum/(scrollSpeedArray.length-1);
	return Math.abs(scrollSpeedArray[0]);
}

function moveFloatBoxes($scroller,speed) {
	var scrollHigh, scrollLow, $targets;
	var s, blurMax, blurX, blurY, direction;

	scrollHigh = 0.2; // scrolled element is vertically high
	scrollLow = 0.5;
	$targets = $scroller.find('.float_target');
	s = speed<5 ? 0.5 : 0.25; // increase animation speed when user scrolls very fast
	blurMax = 100;

	if($(window).width() <= 1020) {
		// tablet sized screen
		blurX = blurMax;
		blurY = 0;
		direction = 'left';
	} else {
		blurX = 0;
		blurY = blurMax;
		direction = 'top';
	}
	if(!narrowScreen && !$scroller.data('stopAnims')) {
		for(var i=0, il=$targets.length;i<il;i++) {
			var $target, top, id, $box, moveTo;

			$target = $targets.eq(i);
			top = $target.offset().top / $(window).height();
			id = $target.attr('id');
			$box = $('#img' + id.substring(1,id.length));
			moveTo = $box.data('moveTo');
			if($box.length>0) {
				// animate target at specific scroll points
				if(top <= scrollHigh && moveTo=='visible') {
					// move box offscreen forward in direction
					$box.data('moveTo','above')
					TweenMax.to($box, s, {
						[direction] : '-50%',
						ease : Power2.easeIn,
					});
					if(isChrome || isFirefox) {
						// Safari renders this too slowly
						$($box).addClass('blur');
						TweenMax.fromTo(blur, s, {
							x : 0,
							y : 0,
						},{
							x : blurX,
							y : blurY,
							ease : Power2.easeIn,
							onUpdate : applyBlur,
							onComplete : function(){
								// since this.target is #blur
								// remove all blurs
								$('.float_box').removeClass('blur');
							}
						});
					}
				} else if(top >= scrollLow && moveTo=='visible') {
					// move box offscreen back in direction
					$box.data('moveTo','below')
					TweenMax.to($box, s, {
						[direction] : '150%',
						ease : Power2.easeIn,
					});
					if(isChrome || isFirefox) {
						// Safari renders this too slowly
						$($box).addClass('blur');
						TweenMax.fromTo(blur, s, {
							x : 0,
							y : 0,
						},{
							x : blurX,
							y : blurY,
							ease : Power2.easeIn,
							onUpdate : applyBlur,
							onComplete : function(){
								// since this.target is #blur
								// remove all blurs
								$('.float_box').removeClass('blur');
							}
						});
					}
				} else if(top > scrollHigh && top < scrollLow && moveTo!='visible') {
					// move box to onscreen center in direction
					$box.data('moveTo','visible');
					TweenMax.to($box, s, {
						[direction]: '50%',
						ease : Back.easeOut.config(1),
						onComplete : function() {
							sendGaEvent('forward','reveal image',this.target[0].id);
						}
					});
					if(isChrome || isFirefox) {
						// Safari renders this too slowly
						$($box).addClass('blur');
						TweenMax.fromTo(blur, s, {
							x : blurX,
							y : blurY,
						},{
							x : 0,
							y : 0,
							ease : Back.easeOut.config(1),
							onUpdate : applyBlur,
							onComplete : function(){
								// since this.target is #blur
								// remove all blurs
								$('.float_box').removeClass('blur');
							}
						});
					}
				}
			}
			/*
				// move target paralax with scroll
				top = (top*200)-30;
				$(id).css('top',top+'%');
			*/
		}
	} else {
		// no animation for narrow screens
		// see narrowScreenImages()
	}
}

function resizeFloatTargets($scroller) {
	var $targets = $scroller.find('.float_target');

	// float_targets create blank space in the
	// paragraph text for the float_box to occupy
	for(var i=0,il=$targets.length; i<il; i++) {
		var id, $img, width, height;

		id = $targets.eq(i).attr('id');
		$img = $('#img' + id.substring(1,id.length));
		width = $img.width();
		width = width < 330 ? 0 : width - 330;
		height = $img.height();
		height = height < 350 ? 350 : height * 0.8;
		$targets.eq(i).css({
			width : width,
			height : height
		});
	}
	// prevent targets from overlapping
	for(var i=0,il=$targets.length-1; i<il; i++) {
		var height, bottom, top;

		height = $targets.eq(i).height();
		bottom = $targets.eq(i).offset().top + height;
		top = $targets.eq(i+1).offset().top;
		if(bottom > top) {
			height = height + (top - bottom);
			$targets.eq(i).css({
				height : height
			});
		}
	}
}

function maximizeFloatBox($box) {
	if(!narrowScreen) {
		if($box.data('maximized')) {
			$box.css('width','');
			$box.css('height','');
			$box.css('left','');
			$box.data('maximized',false);
		} else {
			var bw = $box.outerWidth()-40;
			var bh = $box.outerHeight()-40;
			var ww = $(window).width();
			var wh = $(window).height();
			var r = 0;
			if(bw > bh) {
				r = bh/bw;
				$box.css('left',0);
				$box.css('width',ww-40);
				$box.css('height',Math.round((ww-40)*r));
			} else {
				r = bw/bh;
				$box.css('width',Math.round((wh-40)*r));
				$box.css('height',wh-40);
			}
			$box.data('maximized',true);
			sendGaEvent('forward',skill + ' ' + window.location.hash,$box.attr('id'));
		}
	}
}

function narrowScreenImages(project) {
	var id;
	if(!project) { var project = ''; }
	if(narrowScreen) {
		// instead of animating the details image onto screen
		// insert them inline so that user must scroll past them
		$(project + '.float_target').each(function(){
			id = $(this).attr('id');
			id = '#img' + id.substring(1,id.length);
			$(this).replaceWith($(id));
		});
	}
}

function updateScrollIndicator($scroller) {
	var $donut, dashMax, ratio;

	if(!narrowScreen) {
		// this element is hidden on narrow screens
		$donut = $('#scroll_amount_indicator circle');
		dashMax = parseInt($donut.attr('r'));
		dashMax = 2*dashMax*Math.PI;
		ratio = $scroller.find('.case_study').height() - $scroller.height();
		ratio = $scroller.scrollTop()/ratio;
		$donut.css('stroke-dasharray',(ratio*dashMax)+' '+dashMax);
	}
}

function bumpCloseButton($scroller) {
	var $el, s, scale, scrollMax;

	scrollMax = $scroller.find('.case_study').eq(0).height() - $scroller.height() - 40;
	if($scroller.scrollTop() >= scrollMax) {
		// user is scrolling near the bottom of $scroller
		if(narrowScreen) {
			$el = $('#navigation a');
			scale = 1.25;
		} else {
			$el = $('#back_to_projects');
			scale = 1.5;
		}
		if(!$el.data('bumping')) {
			$el.data('bumping',true);
			s = 0.4;
			TweenMax.to($el, s/2, {
				ease : Power2.easeOut,
				scale : scale
			});
			TweenMax.to($el, s/2, {
				delay : s/2,
				ease : Power2.easeIn,
				scale : 1,
				clearProps : 'scale'
			});
			TweenMax.delayedCall(1, function(){
				$el.data('bumping',false);
				if(!$scroller.data('stopAnims')) {
					sendGaEvent('forward','scrolled to bottom',window.location.hash);
				}
			});
		}
	}
}

function hidePage(pageToHide) {
	// hides about or contact
	var s=0.5;
	var $el = $('#'+pageToHide);

	TweenMax.to('.frame', s, {
		'background-color' : 'rgb(255,255,255)'
	});
	TweenMax.to('#stack_button', s, {
		'background-color' : 'rgb(255,255,255)'
	});
	TweenMax.to('#stack_button svg', s, {
		'fill' : 'rgb(193, 84, 238)'
	});
	TweenMax.to($el, s, {
		opacity : 0,
		onComplete : function() {
			$el.attr('style','');
			$(pageToHide +', .content').attr('style','');
			$('.frame').css('background-color','');
			$('#stack_button').css('background-color','');
			$('#stack_button svg').css('fill','');
			$('.float_box').css('display','');
			TweenMax.to('.float_box', s*0.5, {
				delay : s*2,
				opacity : 1,
				clearProps : 'opacity'
			});
		}
	});
}

/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* NAVIGATION BUTTON FUNCTIONS */

function showStackButton() {
	TweenMax.to('#stack_button svg:last-child', 0.5, {
		'opacity' : 0,
	});
	TweenMax.to('#stack_button div > div', 0.5, {
		'transform' : 'rotate(0deg)'
	})
	TweenMax.to('#stack_button svg:first-child', 0.5, {
		'opacity' : 1,
		'transform' : 'scaleX(1)'
	})
}

function hideStackButton() {
	var s = 0.5
	TweenMax.to('#stack_button svg:last-child', s, {
		'opacity' : 1,
	});
	TweenMax.to('#stack_button div > div', s, {
		'transform' : 'rotate(45deg)'
	});
	TweenMax.to('#stack_button svg:first-child', s, {
		'opacity' : 0,
		'transform' : 'scaleX(0.25)'
	});
}

function collapseNavigation() {
	// initiates CSS transiation animation
	$('#contact_button, #about_button').removeClass('hoverable');
	$('#contact_button, #about_button, #stack_button').addClass('collapsed');
}

function expandNavigation() {
	// initiates CSS transiation animation
	$('#contact_button, #about_button').addClass('hoverable');
	$('#contact_button, #about_button, #stack_button').removeClass('collapsed');
}

function doNavTransition(pageToReveal) {
	var s = 1;
	// use hypotenuse of window as the radius
	var diameter = Math.sqrt(Math.pow($(window).height(),2) + Math.pow($(window).width(),2))*2;

	$('#navigation_transition').css('display','block');
	TweenMax.to('#back_to_projects', s*0.5, {
		opacity : 0,
		clearProps : 'opacity',
		onComplete : function() {
			$('#back_to_projects').css('display','');
		}
	});
	TweenMax.to('#stack_button', s*0.5, {
		delay : s*0.2,
		'background-color' : 'rgb(193, 84, 238)'
	});
	TweenMax.to('#stack_button svg', s*0.25, {
		delay : s*0.1,
		'fill' : 'white'
	});
	TweenMax.to('.float_box', s*0.5, {
		opacity : 0,
		onComplete : function() {
			$('.float_box').css('display','none');
		}
	});
	TweenMax.to('#navigation_transition div', s*0.5, {
		delay : s*0.2,
		ease : Back.easeOut.config(3),
		'width' : 400,
		'height' : 400
	});
	TweenMax.to('#navigation_transition div', s*0.75, {
		delay : s*0.7,
		ease : Power4.easeIn,
		'width' : diameter,
		'height' : diameter
	});
	TweenMax.to('.frame', s*1.25, {
		delay : s*1.1,
		'background-color' : 'rgb(193, 84, 238)'
	});
	TweenMax.delayedCall(s*1.5, function(){
		var $el = $('#'+pageToReveal);
		$el.css('display','block');
		TweenMax.to('#navigation_transition', s*0.5, {
			'opacity' : 0,
			onComplete : function() {
				$('#navigation_transition').attr('style','');
				$('#navigation_transition div').attr('style','');
			}
		});
	});
}

function checkVibrationSupport() {
	var $vs = $('#vibration_supported');
	var $vns = $('#vibration_not_supported');
	if(navigator.vibrate) {
		$vns.css('display','none');
	} else {
		$vs.css('display','none');
	}
}

function sendGaEvent(category, action, label) {
	// categories: 'forward', 'back', 'out'
	// actions:  what element was interacted with
	// labels:
	//     forward:  where the interaction leads to
	//     back:  where the interaction started from
	//     out:  outbound url the interaction leads to
	ga('send', 'event', {
		eventCategory: category,
		eventAction: action,
		eventLabel: label
	});
	gtag('event', action, {
		'event_category': category,
		'event_label': label
	});
	//	console.log(category + '-' + action + '-' + label);
}

/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* EVENT BINDINGS */

function bindEvents() {
	window.addEventListener('popstate', function(event) {
		sendGaEvent('back','browser back','from ' + page);
		if(page == 'details') {
			hideDetails();
			showStackButton();
			page = lastPage;
		} else if(page == 'content' || page == 'about') {
			hideStack();
			showStackButton();
			expandNavigation();
			hidePage(page);
			page = lastPage;
		}
	});
	$(window).resize(function() {
		clearTimeout($.data(this, 'resizeTimer'));
		$.data(this, 'resizeTimer', setTimeout(function() {
			// execute after resizing stops
			narrowScreen = $(window).width() < 760 ? true : false
			if(page == 'projects') {
				revealProjects();
			}
		}, 500));
	});
	$('body, #contact_button, #about_button, #stack_button').click(function(vars) {
		var el, isFull;
		if(narrowScreen) {
			el = $('body')[0];
			document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;
			isFull = document.fullscreenElement;
			if (document.fullscreenEnabled && !isFull) {
				if (el.requestFullscreen) {
					el.requestFullscreen();
				} else if (el.mozRequestFullScreen) {
					el.mozRequestFullScreen();
				} else if (el.webkitRequestFullScreen) {
					el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			}
		}
	});

	$('#home_start').click(function() {
		page = 'stack';
		showStack();
		hideStackButton();
		sendGaEvent('forward','start','skill stack');
	});
	$('.skill').click(function() {
		if($(this).hasClass('hoverable')) {
			// page = 'projects' is set
			// at the end of animation
			if($(this).is($('#skill_artwork'))) {
				var link = 'side_projects/sideprojects.html';
				window.open(link)
			} if($(this).is($('#skill_skip'))) {
				var link = 'screen_caps.html';
				window.open(link)
				sendGaEvent('forward','project tab','skip');
			} else {
				highlightSkill($(this));
				showStackButton();
				filterProjects($(this));
				revealProjects();
				skill = $(this).attr('id');
			}
			sendGaEvent('forward','skill stack',skill);
		} else if(page = 'projects') {
			lastPage = page;
			page = 'stack';
			hideProjects(false);
			sendGaEvent('back','stack scroll','from projects');
		}
	});
	$('.skill').mousemove(function(event) {
		if($(this).hasClass('hoverable')) {
			glowSkillOnHover(event,$(this),true);
		}
	});
	$('.skill').mouseleave(function(event) {
		glowSkillOnHover(event,$(this),false);
	});
	$('#home .content').scroll(function() {
		if(page == 'projects') {
			lastPage = page;
			page = 'stack';
			hideProjects(false);
			sendGaEvent('back','stack scroll','from projects');
		}
	});
	$('.tab').click(function() {
		switchProject(this);
		sendGaEvent('forward','project tab',$(this).attr('eventName'));
	});
	$('.project .button').click(function() {
		revealDetails();
		hideStackButton();
		lastPage = page;
		page = 'details';
		window.history.pushState(null, null, $(this).attr('href'));
		sendGaEvent('forward','project button',$(this).attr('href'));
		return false;
	});
	$('#back_to_projects').click(function() {
		hideDetails();
		showStackButton();
		lastPage = page;
		page = 'projects';
		sendGaEvent('back','details closer','from ' + window.location.hash);
		window.history.pushState(null, null, 'index.html');
		return false;
	});
	$('body').keyup(function(event) {
		if(event.keyCode == 27) {
			hideDetails();
			showStackButton();
			lastPage = page;
			page = 'projects';
			sendGaEvent('back','escape','from ' + window.location.hash);
			window.history.pushState(null, null, 'index.html');
		}
	});
	$('.scroller').scroll(function() {
		moveFloatBoxes($(this),getFloatBoxSpeed($(this)));
		updateScrollIndicator($(this));
		bumpCloseButton($(this));
	});
	$('.float_box').mouseenter(function(){
		var id, $scroller, s, height, top;

		if($(window).width() >= 760 && $(window).width() <= 1020) {
			id = $(this).attr('id');
			id = id.substr(id.indexOf('_')+1,4);
			$scroller = $('#details_'+id).find('.scroller');
			s = 0.5;
			height = $('#navigation').outerHeight(true);
			if(!$scroller.data('initialHeight')) {
				$scroller.data('initialHeight',$scroller.height());
			}
			TweenMax.to($scroller, s, {
				ease : Power4.easeOut,
				'height' : height
			})
			top = ($(window).height() - $(this).height())/2;
			if(!$(this).data('initialTop')) {
				$(this).data('initialTop',$(this).css('top'));
			}
			TweenMax.to($(this), s, {
				ease : Power4.easeOut,
				'top' : top
			})
		}
	});
	$('.float_box').mouseleave(function(event){
		var id, $scroller, s, height, top;

		if($(window).width() >= 760 && $(window).width() <= 1020) {
			if(event.pageY < $(this).offset().top) {
				id = $(this).attr('id');
				id = id.substr(id.indexOf('_')+1,4);
				$scroller = $('#details_'+id).find('.scroller');
				s = 0.5;
				height = $scroller.data('initialHeight');
				TweenMax.to($scroller, s, {
					ease : Power4.easeOut,
					'height' : height
				})
				top = $(this).data('initialTop');
				TweenMax.to($(this), s, {
					ease : Power4.easeOut,
					'top' : top
				});
			}
		}
	});
	$('.float_box').not('.ga_event_out').click(function(event) {
		maximizeFloatBox($(this));
	});
	$('.ga_event_out').click(function(event) {
		var parent, children, count, link;

		$parent = $(this).closest('.details');
		$children = $parent.find('.ga_event_out');
		for(var i=0,il=$children.length;i<il;i++) {
			if($(this).is($children.eq(i))) {
				count = i;
			}
		}

		link = $(this).attr('outBoundLink');
		if(!link) {
			link = event.target.href;
		}
		window.open(link)
		sendGaEvent('out', skill + ' ' + window.location.hash + ' ' + count, link);
		return false;
	});
	$('#img_SiPo_commercial, #a_SiPo_play_button').click(function(){
		var video = $(this).closest('.frame').find('video')[0];
		if(video.paused) {
			video.play();
		} else {
			video.pause();
		}
		sendGaEvent('forward',skill + ' ' + window.location.hash + ' ' + 0,'play video');
		return false;
	});
	$('#contact_button').click(function() {
		hideStackButton();
		collapseNavigation();
		doNavTransition('contact');
		lastPage = page;
		page = 'contact';
		sendGaEvent('forward','navigation','#contact');
		window.history.pushState(null, null, '#contact');
		return false;
	});
	$('#about_button').click(function() {
		hideStackButton();
		collapseNavigation();
		doNavTransition('about');
		lastPage = page;
		page = 'about';
		sendGaEvent('forward','navigation','#about');
		window.history.pushState(null, null, '#about');
		return false;
	});
	$('#stack_button').click(function() {
		if(page == 'start') {
			page = 'stack';
			showStack();
			hideStackButton();
			sendGaEvent('forward','navigation','skill stack');
		} else if(page == 'stack') {
			page = 'start';
			hideStack();
			showStackButton();
			sendGaEvent('back','navigation','from stack');
		} else if(page == 'projects') {
			page = 'stack';
			hideProjects();
			hideStackButton();
			sendGaEvent('back','navigation','from projects');
		} else if(page == 'details') {
			page = 'projects';
			hideDetails();
			showStackButton();
			sendGaEvent('back','navigation','from ' + window.location.hash);
			window.history.pushState(null, null, 'index.html');
		}
		if(page == 'contact' || page == 'about') {
			sendGaEvent('back','navigation','from ' + page);
			hidePage(page);
			page = lastPage;
			if(lastPage == 'details') {
				showDetailsCloseButton(1);
				window.history.pushState(null, null, $activeProject.find('a').eq(0).attr('href'));
			} else {
				window.history.pushState(null, null, 'index.html');
			}
			expandNavigation();
		} else {
			lastPage = page;
		}
		return false;
	});
	$('#enter_password').click(function() {
		var pw = window.prompt('Enter password:');
		insertDecryptedContent(pw,'manual');
		return false;
	});
}

/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* PASSWORD PROTECTED CONTENT */

// code from https://github.com/bradyjoslin/webcrypto-example/blob/master/script.js
const base64_to_buf = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(null));
const enc = new TextEncoder();
const dec = new TextDecoder();
const getPasswordKey = (password) => window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey",]);
const deriveKey = (passwordKey, salt, keyUsage) =>
	window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 250000,
			hash: "SHA-256",
		},
		passwordKey,
		{
			name: "AES-GCM",
			length: 256
		},
		false,
		keyUsage
	);

async function decryptData(encryptedData, password) {
  try {
	const encryptedDataBuff = base64_to_buf(encryptedData);
	const salt = encryptedDataBuff.slice(0, 16);
	const iv = encryptedDataBuff.slice(16, 16 + 12);
	const data = encryptedDataBuff.slice(16 + 12);
	const passwordKey = await getPasswordKey(password);
	const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
	const decryptedContent = await window.crypto.subtle.decrypt(
	  {
		name: "AES-GCM",
		iv: iv,
	  },
	  aesKey,
	  data
	);
	return dec.decode(decryptedContent);
  } catch (e) {
	console.log(`Error - ${e}`);
	return "";
  }
}

async function insertDecryptedContent(pw,pwEntryType) {
	var decryptedCount = 0;
	const caseStudySensDec = await decryptData(caseStudySensEnc, pw);
	if(caseStudySensDec) {
		decryptedCount++;
		$('#details_Sens .case_study').html(caseStudySensDec);
	}
	var id = '';
	var $float = $('<div>');
	$float.addClass('float_box');
	$float.append('<div>');
	const detailsSensAnalyticsOldDec = await decryptData(detailsSensAnalyticsOldEnc, pw);
	if(detailsSensAnalyticsOldDec) {
		decryptedCount++;
		id = 'img_Sens_Analytics_Old';
		$float.attr('id',id);
		$('#details_Sens .content').after($float.clone());
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensAnalyticsOldDec;
		img.alt = 'Design of Sense analytics page before this project began';
		$('#'+id).prepend($(img));
	}
	const detailsSensAnalyticsExplore1Dec = await decryptData(detailsSensAnalyticsExplore1Enc, pw);
	if(detailsSensAnalyticsExplore1Dec) {
		decryptedCount++;
		id = 'img_Sens_Analytics_Explore1';
		$float.attr('id',id);
		$('#details_Sens .content').after($float.clone());
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensAnalyticsExplore1Dec;
		img.alt = 'Early lo-fidelity mockups of potential analtyics components';
		$('#'+id).prepend($(img));
	}
	const detailsSensAnalyticsExplore2Dec = await decryptData(detailsSensAnalyticsExplore2Enc, pw);
	if(detailsSensAnalyticsExplore2Dec) {
		decryptedCount++;
		id = 'img_Sens_Analytics_Explore2';
		$float.attr('id',id);
		$('#details_Sens .content').after($float.clone());
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensAnalyticsExplore2Dec;
		img.alt = 'Another interation of components, at higher fidelity';
		$('#'+id).prepend($(img));
	}
	const detailsSensAnalyticsExplore3Dec = await decryptData(detailsSensAnalyticsExplore3Enc, pw);
	if(detailsSensAnalyticsExplore3Dec) {
		decryptedCount++;
		id = 'img_Sens_Analytics_Explore3';
		$float.attr('id',id);
		$('#details_Sens .content').after($float.clone());
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensAnalyticsExplore3Dec;
		img.alt = 'Another iteration of components, reducing complexity';
		$('#'+id).prepend($(img));
	}
	const detailsSensAnalyticsExplore4Dec = await decryptData(detailsSensAnalyticsExplore4Enc, pw);
	if(detailsSensAnalyticsExplore4Dec) {
		decryptedCount++;
		id = 'img_Sens_Analytics_Explore4';
		$float.attr('id',id);
		$('#details_Sens .content').after($float.clone());
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensAnalyticsExplore4Dec;
		img.alt = 'Exploration of line chart component';
		$('#'+id).prepend($(img));
	}
	const detailsSensAnalyticsExplore5Dec = await decryptData(detailsSensAnalyticsExplore5Enc, pw);
	if(detailsSensAnalyticsExplore5Dec) {
		decryptedCount++;
		id = 'img_Sens_Analytics_Explore5';
		$float.attr('id',id);
		$('#details_Sens .content').after($float.clone());
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensAnalyticsExplore5Dec;
		img.alt = 'Nearly finalized analytics components';
		$('#'+id).prepend($(img));
	}
	const detailsSensAnalytics1Dec = await decryptData(detailsSensAnalytics1Enc, pw);
	if(detailsSensAnalytics1Dec) {
		decryptedCount++;
		id = 'img_Sens_Analytics1';
		$float.attr('id',id);
		$('#details_Sens .content').after($float.clone());
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensAnalytics1Dec;
		img.alt = 'Final design of analtyics page at project completion';
		$('#'+id).prepend($(img));
	}
	const detailsSensAnalytics2Dec = await decryptData(detailsSensAnalytics2Enc, pw);
	if(detailsSensAnalytics2Dec) {
		decryptedCount++;
		$('#' + id).find('div').css('backgroundImage','url(data:image/png;base64,' + detailsSensAnalytics2Dec + ')');
	}
	if(decryptedCount<9 && pwEntryType == 'manual') {
		alert('Sorry, the password you entered was incorrect.  Please try again, or contact Mattthew for the password.');
	} else {
		localStorage.setItem('password',pw);
		$scroller = $('#details_Sens .scroller');
		resizeFloatTargets($scroller);
		narrowScreenImages('#details_Sens '); // space after id is intentional
		$('#details_Sens .float_box').not('.ga_event_out').click(function(event) {
			maximizeFloatBox($(this));
		});
	}
}

$('#last_encoded_file').on('load',function() {
	if(localStorage.getItem('password')) {
		var pw = localStorage.getItem('password');
		insertDecryptedContent(pw,'auto');
	}
});

/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
/* ON LOAD */

// constants

// variables
var narrowScreen = $(window).width() < 760 ? true : false
var isChrome = navigator.userAgent.indexOf('Chrome') > -1 ? true : false; // This is used to handle browser differences in the animation of SVG filters.  It sucks to do it this way but there's no specific property that I can test for.
var isFirefox = navigator.userAgent.indexOf('Firefox') > -1 ? true : false;

var blur = {
	x:0,
	y:0
};
var shadow = {
	y:0,
	r:0,
	a:0,
	$el:$('body')
};
var page = 'start';
var lastPage = 'start';
// pages:  start, stack, projects, details, contact, about
var skill; // which skill is active
var $activeProject;
var highlightDuration = 0; // duration of skill highlighting animation
var scrollSpeedArray = [0]; // speed of details images animations

TweenLite.defaultEase = Linear.easeNone;
bindEvents();
makeSVGInline();
// navigateToHash executed by makeSVGInline;
narrowScreenImages();
checkVibrationSupport();
