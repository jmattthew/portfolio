$(window).load(function() {

	// GLOBAL VARS
	var sections = [];
	var lastSection = 0;
	var currentSection = 1;
	var docHeight = $( window ).height();

	//
	function getSectionLocations() {
		var num = 1;
		$('.animated').each(function() {
			sections[num] = {};
			sections[num].offsetY = $(this).offset().top;
			sections[num].id = $(this).attr('id');
			num++;
		});
	}

	//
	function setSectionColors() {
		// minimap colors
		sections[1].color = 'rgb(0, 0, 0)'; // fermi black
		sections[2].color = 'rgb(255, 200, 102)'; // documentary orange cream
		sections[3].color = 'rgb(235, 235, 235)'; // portraits snow
		sections[4].color = 'rgb(118, 206, 255)'; // mixed media powder blue
		sections[5].color = 'rgb(0, 0, 0)'; // watch black
		sections[6].color = 'rgb(255, 255, 255)'; // shsh white
		sections[7].color = 'rgb(255, 165, 0)'; // get ready orange
		sections[8].color = 'rgb(0, 0, 0)'; // essays black
	}

	//
	function getCurrentSection() {
		var wHash = window.location.hash;
		if(wHash.length > 9) {
			wHash = wHash.substr(9); // leaving just the number
			currentSection = parseInt(wHash);
		}
	}

	//
	function initiateMinimap() {
		var num = currentSection;
		$('#map' + num + ' A').css('width','12px');
		$('#map' + num + ' A').css('height','12px');
		$('#map' + num + ' A').css('margin','1px 6px');
		$('#map' + num + ' A').css('background-color',sections[num].color);
		$('#map' + num + ' A').css('box-shadow','0px 0px 2px 0px rgba(0, 0, 0, 0.3)');
	}

	function bindMiniMapEvents() {
		// replace jump scrolls with smooth animated scroll
		for(var i=1, iL=sections.length; i<iL; i++) {
			$('#map'+ i + ' A').click(function() {
				var id = $(this).attr('href');
				var y = $(id).offset().top;
				y -= 100;
				$('html, body').animate({
					scrollTop: y
				}, 500);
				return false;
			});
		}
	}

	function fixMobileBackgrounds() {
		/*
			note:  Modernizr.touch check removed

			Most mobile browsers don't support fixed backgrounds,
			so these sections will look broken

			$('#sectionWatch, #sectionFermi, #sectionPortraits').css('background-attachment','scroll');
		*/
	}

	// starts animtion for currentSection
	function doAnimation() {

		if(currentSection==1) {

			// note:  Modernizr.touch check removed - this won't work on some mobile devices

			// fermi (disabled on touch because too slow)
			var str = $('#logoFermi SPAN').css('font-size');
			var startNum = parseInt(str.substr(0,str.length-2));
			var endNum = startNum + 7;
			$('#logoFermi SPAN').animate({
				fontSize: endNum
			}, {
				'duration': 200,
				'easing': 'easeOutCirc'
			});
			$('#logoFermi').animate({
				paddingTop: 25,
				paddingBottom: 45
			}, {
				'duration': 200,
				'easing': 'easeOutCirc',
				'complete': function() {
					$('#logoFermi').animate({
						paddingTop: 30,
						paddingBottom: 50
					}, {
						'duration': 200,
						'easing': 'easeInCirc'
					});
					$('#logoFermi SPAN').animate({
						fontSize: startNum
					}, {
						'duration': 200,
						'easing': 'easeInCirc'
					});
				}
			});

		} else if(currentSection==2) {

			// documentary
			var x = $('#sectionDocumentary .button DIV').width() -2;
			var el = $('#sectionDocumentary .button I')[0];
			$(el).animate({
				width: x,
			}, {
				'duration': 1000,
				'queue': false,
				'easing': 'easeInCubic'
			});
			$(el).animate({
				opacity: 0,
			}, {
				'duration': 1500,
				'queue': false,
				'easing': 'linear',
				'complete': function() {
					$(el).css('opacity','1');
					$(el).css('width','0px');
				}
			});

		} else if(currentSection==3) {

			// portraits
			// nothing yet

		} else if(currentSection==4 ) {

			// mixed
			// nothing yet

		} else if(currentSection==5) {

			// watch
			var str = $('#sectionWatch').css('background-size');
			str = str.substring(0,str.indexOf(' ')-2);
			var x = parseInt(str);
			$({count:0}).animate({count:x}, {
				duration: 1000,
				easing: 'easeOutQuad',
				step: function() {
					$('#sectionWatchEffect').css('background','linear-gradient(to right, rgba(0, 0, 0, 1) ' + ((x*0.75)-this.count) + 'px, rgba(0, 0, 0, 0.1) ' + ((x*1.1)-this.count) + 'px, rgba(0, 0, 0, 0) ' + ((x*1.25)-this.count) + 'px');
				}
			});

		} else if(currentSection==6) {

			// shsh
			var str = $('#logoShsh SPAN').css('background-image');
			str = str.substring(5,str.length-2);
			str = str.replace('.png','_animated.gif?p=' + new Date().getTime());
			var img = document.createElement('img');
			img.src = str;
			$(img).load(function() {
				$('#logoShsh SPAN').css('background-image','url(' + img.src + ')');
			});

		} else if(currentSection==7) {

			// get ready
			// nothing yet

		} else if(currentSection==8) {

			// essays
			// nothing yet

		}


	}

	//
	function setStartAnimation(num) {
		if(num == 1) {

			// note:  Modernizr.touch check removed - this won't work on some mobile devices

			// fermi
			// end is same as start

		} else if(num==2) {

			// documentary
			// end is same as start

		} else if(num==3) {

			// portraits
			// nothing yet

		} else if(num==4) {

			// mixed
			// nothing yet

		} else if(num==5) {

			// watch
			var str = $('#sectionWatch').css('background-size');
			str = str.substring(0,str.indexOf(' ')-2);
			var x = parseInt(str);
			$({count:x}).animate({count:0}, {
				duration: 500,
				easing: 'linear',
				step: function() {
					$('#sectionWatchEffect').css('background','linear-gradient(to right, rgba(0, 0, 0, 1) ' + ((x*0.75)-this.count) + 'px, rgba(0, 0, 0, 0.1) ' + ((x*1.1)-this.count) + 'px, rgba(0, 0, 0, 0) ' + ((x*1.25)-this.count) + 'px');
				}
			});

		} else if(num==6) {

			// shsh
			$('#logoShsh SPAN').css('background-image','');

		} else if(num==7) {

			// get ready
			// nothing yet

		} else if(num==8) {

			// essays
			// nothing yet

		}
	}

	// call resize after browser window resizing has stopped
    $(window).resize(function() {
		clearTimeout($.data(this, 'scrollTimer'));
		$.data(this, 'scrollTimer', setTimeout(function() {
			docHeight = $( window ).height();
			getSectionLocations();
		}, 500));
	});

    // find which section the user is looking at
	$(window).scroll(function() {

		var scrollY = $(document).scrollTop();
		// section is updated when 'animated' class within
		// the section reaches .5 way up the page
		var y = scrollY + docHeight - 15 - (docHeight*0.5);
		for(var i=1, iL=sections.length; i<iL; i++) {
			if(y<sections[i].offsetY) {
				// find nearest animated element that is below y
				lastSection = currentSection;
				currentSection = i-1;
				break;
			} else if(y>sections[totalSections].offsetY) {
				// if y is below all animated elements
				lastSection = currentSection;
				currentSection = totalSections;
				break;
			}
		}

		// set miniMap
		if(currentSection != lastSection) {
			for(var i=1; i<sections.length; i++) {
				$('#map'+ i + ' A').css('width','');
				$('#map'+ i + ' A').css('height','');
				$('#map'+ i + ' A').css('margin','');
				$('#map'+ i + ' A').css('background-color','');
				$('#map'+ i + ' A').css('box-shadow','');
			}
			var num = currentSection;
			$('#map'+ num + ' A').css('width','12px');
			$('#map'+ num + ' A').css('height','12px');
			$('#map'+ num + ' A').css('margin','1px 6px');
			$('#map'+ num + ' A').css('background-color',sections[num].color);
			$('#map'+ num + ' A').css('box-shadow','0px 0px 2px 0px rgba(0, 0, 0, 0.3)');
		}

		if(scrollY == 1) {
			// triggers highest animation
			doAnimation();
		}

		if(currentSection > lastSection) {
			// scrolling down:
			// start this section's animation
			doAnimation();
		} else if(currentSection < lastSection) {
			// scrolling up:
			// reset animations for all section below -
			// this section + 2 so that reset isn't visible
			for(var i=currentSection+2; i<totalSections; i++) {
				setStartAnimation(i);
			}
			// because  this section + 2 is never 1
			if(currentSection==1) {
				setStartAnimation(1);
			}
		}
	});

	// ACTION
	getSectionLocations();
	setSectionColors();
	getCurrentSection();
	initiateMinimap();
	bindMiniMapEvents();
	fixMobileBackgrounds();

	// css puts all animations at their end position so
	// set current and lower animations to their start position
	var totalSections = $('.section').length-1;
	for(var i=currentSection; i<totalSections; i++) {
		setStartAnimation(i);
	}

});






