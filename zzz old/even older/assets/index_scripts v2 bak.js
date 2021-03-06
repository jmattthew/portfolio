$(window).load(function() {

	// GLOBAL VARS
	var sections = [];
	var docHeight = $(window).height();
	var lastSection = 0;
	var currentSection = 0;
	var hasScrolled = false;
	var allowShardEdit = false;
	var shards = 1;
	var shardAngle = 2; 
	var shardWidth = 40;
	var shardSpacing = 5;
	var headerTitle = 'Mattthew';
	var headerSubtitle = 'Product Designer, Storyteller, & Artist.  Click on my name!';

	$('#sectionHeader').bind('reveal',function(event){
		$(this).find('p span').animate({
			top: 0
		}, {
			duration: 200,
			easing: 'easeOutQuad',
			complete: function() {
			}
		});
	});

	// dublicate initial shard and clipping paths
	$('#shardHolder').bind('addShards',function(event) {
		var xl = Math.ceil($('#shard_0 span').width()/(shardWidth+shardSpacing));
		for(var x=1; x<xl; x++) {
			$('#shard_0').clone(true).appendTo($('#shardHolder')).attr('id','shard_'+x);
			$('#moz_clip_shard_0').clone(false).appendTo($('#moz_clips')).attr('id','moz_clip_shard_'+x);
			shards++;
		}
	});

	// add clipping to each shard and position offscreen
	$('#shardHolder').bind('addShardCSS',function(event) {
		$(this).find('.shard').each(function(index){
			$(this).css('visibility','visible');
			var h = $(this).height()*-1;
			var y = ($(this).offset().top*-1)+h;
			var x = (y/(shardAngle))*-1;
			$(this).css('margin-bottom',h+'px');
			$(this).css('top',y+'px');
			$(this).css('left',x+'px');
			h = h*-1;
			var spacing = index*(shardWidth+shardSpacing);
			var p1x = spacing;
			var p1y = 0;
			var p2x = (spacing)-(h/shardAngle);
			var p2y = h;
			var p3x = (spacing)-(h/shardAngle)+(shardWidth);
			var p3y = h;
			var p4x = (spacing)+(shardWidth);
			var p4y = 0;
			$('#moz_clip_shard_'+index).children().eq(0).attr('points',p1x+' '+p1y+','+p2x+' '+p2y+','+p3x+' '+p3y+','+p4x+' '+p4y);
			$(this).find('span').css('clip-path','url(#moz_clip_shard_'+index+')');
			$(this).find('span').css('-webkit-filter','blur(5px)');
			$(this).find('span').css('-webkit-clip-path','polygon('+p1x+'px '+p1y+'px,'+p2x+'px '+p2y+'px,'+p3x+'px '+p3y+'px,'+p4x+'px '+p4y+'px)');
		});
		$('#shardSpacer').css('margin-bottom',$('#shard_0').height());
	});

	// start each shard animation at slightly different times
	$('#shardHolder').bind('dropShards',function(event) {
		$(this).find('.shard').each(function(index) {
			var delay = Math.random()*750;
			$(this).trigger('drop',[delay,index]);    
		});
	});

	// animate individual shard
	$('#shardHolder').bind('bindEvents',function(event) {
		$('#shard_0').bind('drop',function(event,delay,index) {
			$(this).delay(delay).animate({
				top: 0,
				left: 0,
			}, {
				duration: 250,
				easing: 'easeInQuad',
				complete: function() {
					shards--;
					$(this).find('span').css('-webkit-filter','');
					// after all shards animate
					if(shards==0) {
						$('#shardHolder').trigger('unifyShards');
					}
				}
			});
		});
	});

	// wrap up animation 
	$('#shardHolder').bind('unifyShards',function(event) {
		$('#shard_0').clone(false).appendTo($('#shardHolder')).attr('id','shard_glow'); 
		$('#shard_0').clone(false).appendTo($('#shardHolder')).attr('id','shard_end'); 
		$('#shard_end').addClass('endShard');
		$('#shard_end').css('opacity','0');
		$('#shard_end').find('span').css('-webkit-clip-path','');
		$('#shard_end').find('span').css('clip-path','');
		$('#shard_glow').addClass('endShard');
		$('#shard_glow').css('opacity','0');
		$('#shard_glow').find('span').css('-webkit-clip-path','');
		$('#shard_glow').find('span').css('clip-path','');
		$('#shard_glow').find('span').css('-webkit-filter','blur(5px)');
		$('#shard_end').animate({
			opacity: 1,
		}, {
			duration: 400,
			easing: 'easeOutQuad',
			complete: function() {
			}    
		});
		$('#shard_glow').animate({
			opacity: 1,
		}, {
			duration: 300,
			easing: 'linear',
			complete: function() {   
				$('#shard_glow').animate({
					opacity: 0,
				}, {
					duration: 150,
					easing: 'easeOutQuad',
					complete: function() {
						$('#shardHolder').trigger('removeShards');
					}    
				});
			}    
		});
	});

	// remove dublicate shards
	$('#shardHolder').bind('removeShards',function(event) {
		$(this).find('.shard').each(function(index){
			if($(this).attr('id').indexOf('end')<0) {
				$(this).remove();
			}
		});
		$(this).find('#shard_end').attr('id','shard_0').removeClass('endShard');
		$('#sectionHeader').trigger('reveal');
		shards = 1;
		allowShardEdit = true;
	});

	//
	$('#shardHolder').click(function() {
		if(!Modernizr.touch) {
			if(allowShardEdit) {
				$('#shardHolder').css('display','none');
				$('#shardSpacer').css('display','none');
				$('#shardEditor').css('display','block');
				$('#shardEditor').focus();
				$('#shardEditor')[0].setSelectionRange(0, $('#shardEditor')[0].value.length);
				$('#sectionHeader p span').css('top','25px');
				$('#sectionHeader p span').html('has great taste in designers!');
			}
			return false;
		}
	});

	//
	$('#shardEditor').blur(function() {
		allowShardEdit = false;
		var el = $('#shardEditor')[0];
		if(el.value=='Your Name' || el.value.length < 3) { el.value='Somebody here' }
		$('#shard_0 span').html(el.value);
		$('#shard_0').css('visibility','hidden');
		$('#shardHolder').css('display','block');
		$('#shardSpacer').css('display','block');
		$('#shardEditor').css('display','none');
		$('#shardHolder').trigger('bindEvents');
		$('#shardHolder').trigger('addShards');
		$('#shardHolder').trigger('addShardCSS');
		$('#shardHolder').trigger('dropShards');			
	});

	//
	$('#shardEditor').keydown(function(e) {
		if (e.which == '9' || e.which == '13') { // tab
			e.preventDefault();
			$(this).blur();
		} else if (e.which == '27') { // escape
			$(this).blur();
		}
	});

	//
	function getSectionLocations() {
		var num = 0;
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
		sections[0].color = 'rgb(87, 150, 0)'; // rotten green
		sections[1].color = 'rgb(0, 0, 0)'; // watch black
		sections[2].color = 'rgb(208, 83, 0)'; // couch orange 
		sections[3].color = 'rgb(0, 0, 0)'; // fermi black
		sections[4].color = 'rgb(255, 255, 255)'; // shsh white
		sections[5].color = 'rgb(255, 0, 153)'; // essay hot pink
		sections[6].color = '#FFC866'; // documentary orange cream
		sections[7].color = 'rgb(235, 235, 235)'; // photo snow
		sections[8].color = 'rgb(118, 206, 255)'; // mixed baby blue
		/*
		sections[].color = 'rgb(100, 65, 165)'; // twitch purple
		*/
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
		$('#map' + currentSection + ' A').css('width','12px');
		$('#map' + currentSection + ' A').css('height','12px');
		$('#map' + currentSection + ' A').css('margin','-2px 6px');
		$('#map' + currentSection + ' A').css('background-color',sections[currentSection].color);
		$('#map' + currentSection + ' A').css('box-shadow','0px 0px 2px 0px rgba(0, 0, 0, 0.3)');
	}

	function bindMiniMapEvents() {
		// replace jump scrolls with smooth animated scroll
		for(var i=0; i<sections.length; i++) {
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
			needed because most mobile browsers 
			don't support fixed backgrounds 
		*/
		if(Modernizr.touch) {
			$('#sectionWatch, #sectionFermi, #sectionPortraits').css('background-attachment','scroll');
		}
	}

	// starts animtion for currentSection
	function doAnimation() {
		if(currentSection==0) {



			// rotten
			var num = 0;
			$('#sectionRotten .button').each(function() {
				var el = this;
				var delay = num*100;
				window.setTimeout(function(){
					$(el).animate({
						opacity: 1
					}, {
						'duration': 2000, 
						'easing': 'easeOutCirc', 
						'queue': false
					}, function() {
						//
					});					
				}, delay);
				window.setTimeout(function(){
					$(el).animate({
						marginTop: 0,
						marginBottom: 0
					}, {
						'duration': 200, 
						'easing': 'easeOutCirc', 
						'queue': false,
						'complete': function() {
							$(el).css('color','');
							$(el).css('text-shadow','');
						}
					});					
				}, delay);
				num++;
			});



		} else if(currentSection==1) {



			// watch
			var str = $('#sectionWatch').css('background-size');
			str = str.substring(0,str.indexOf(' ')-2);
			var x = parseInt(str);
			$({count:0}).animate({count:x}, {
				duration: 2000,
				easing: 'easeOutQuad',
				step: function() {
					$('#sectionWatchEffect').css('background','linear-gradient(to right, rgba(0, 0, 0, 1) ' + ((x*0.75)-this.count) + 'px, rgba(0, 0, 0, 0.1) ' + ((x*1.1)-this.count) + 'px, rgba(0, 0, 0, 0) ' + ((x*1.25)-this.count) + 'px');
				}
			});



		} else if(currentSection==2) {



			// couch
			var num = 0;
			$('#sectionCouch .button DIV').each(function() {
				var el = this;
				var delay = num*100;
				window.setTimeout(function(){
					$(el).animate({
						// no effect in Firefox - too bad
						backgroundPositionX: 296
					}, {
						'duration': 500, 
						'easing': 'linear'
					});					
				}, delay);
				num++;
			});



		} else if(currentSection==3 && !Modernizr.touch) {



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

			// switch header back to normal
			$('#shard_0 span').html(headerTitle);
			$('#sectionHeader p span').html(headerSubtitle);



		} else if(currentSection==4) {



			// shsh
			var str = $('#logoShsh SPAN').css('background-image');
			str = str.substr(4,str.length-9);
			var img = document.createElement('img');
			img.src = str + '_animated.gif?p=' + new Date().getTime();
			$(img).load(function() {
				$('#logoShsh SPAN').css('background-image','url(' + img.src + ')');
			});



		} else if(currentSection==5) {




			// essays
			// nothing yet



		} else if(currentSection==6) {



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



		} else if(currentSection==7) {



			// portraits
			// nothing yet



		} else if(currentSection==8) {



			// mixed
			// nothing yet



		}

			// twitch
			/*
			$('#logoTwitch DIV').animate({
				backgroundPositionX: -358
				// won't work on firefox
			}, {
				'duration': 600, 
				'easing': 'easeInOutBack', 
			});	
			*/

	}

	// 
	function setStartAnimation(num) {
		if(num == 0) {
			// rotten
			$('#sectionRotten .button').css('color','rgba(0, 0, 0, 0.6)');
			$('#sectionRotten .button').css('text-shadow','0px -3px 6px rgba(0, 0, 0, 0.6)');
			$('#sectionRotten .button').css('opacity','0');
			$('#sectionRotten .button').css('margin-top','-20px');
			$('#sectionRotten .button').css('margin-bottom','20px');
		} else if(num==1) {
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
		} else if(num==2) {
			// couch
			$('#sectionCouch .button DIV').css('background-position','-296px 0px');
		} else if(num==3 && !Modernizr.touch) {
			// fermi
			// end is same as start
		} else if(num==4) {
			// shsh
			$('#logoShsh SPAN').css('background-image','');
		} else if(num==5) {
			// essays
			// nothing yet
		} else if(num==6) {
			// documentary
			// end is same as start
		} else if(num==7) {
			// portraits
			// nothing yet
		} else if(num==8) {
			// mixed
			// nothing yet
		}
		/*
			// twitch
			$('#logoTwitch DIV').css('background-position','-680px');
		*/
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

		// animates the top section on fist scroll
		if(!hasScrolled) {
			doAnimation();
			hasScrolled = true;
		}

		var scrollY = $(document).scrollTop();
		// section is updated when 'animated' class within 
		// the section reaches .5 way up the page
		var y = scrollY + docHeight - 15 - (docHeight*0.5);
		var iL = sections.length;
		for(var i=0; i<iL; i++) {
			if(y<sections[i].offsetY) {
				lastSection = currentSection;
				currentSection = i-1;
				break;				
			} else if(y>sections[totalSections-1].offsetY) {
				lastSection = currentSection;
				currentSection = totalSections-1;
				break;								
			}
		}
		if(currentSection<0) { currentSection = 0; }

		// set miniMap 
		for(var i=0; i<sections.length; i++) {
			$('#map'+ i + ' A').css('width','');
			$('#map'+ i + ' A').css('height','');
			$('#map'+ i + ' A').css('margin','');	
			$('#map'+ i + ' A').css('background-color','');	
			$('#map'+ i + ' A').css('box-shadow','');	
		}
		$('#map'+ currentSection + ' A').css('width','12px');
		$('#map'+ currentSection + ' A').css('height','12px');
		$('#map'+ currentSection + ' A').css('margin','1px 6px');
		$('#map'+ currentSection + ' A').css('background-color',sections[currentSection].color);
		$('#map'+ currentSection + ' A').css('box-shadow','0px 0px 2px 0px rgba(0, 0, 0, 0.3)');

		// trigger animation start if users is scrolling down
		if(currentSection > lastSection) {
			// scrolling down:  
			// start this section's animation
			doAnimation();
		} else if(currentSection < lastSection) {
			// scrolling up:
			// set to start all animations below this section
			for(var i=currentSection+2; i<totalSections; i++) {
				setStartAnimation(i);
			}
			// because currentSection+2 is never 1
			if(currentSection==0) {
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

	// css puts all animations at their end position
	// set current and lower animations to their start position
	var totalSections = $('.section').length-2; 
	for(var i=currentSection; i<totalSections; i++) {
		setStartAnimation(i);
	}

	if(!Modernizr.touch) {
		$('#sectionHeader').trigger('reveal');
		var animationTimer = window.setTimeout(function() {
			$('#shardHolder').trigger('bindEvents');
			$('#shardHolder').trigger('addShards');
			$('#shardHolder').trigger('addShardCSS');
			$('#shardHolder').trigger('dropShards');			
		}, 800);
	} else {
		// these animations move too slowly on mobile devices
		$('#shard_0').css('visibility','visible');
		$('#sectionHeader p span').css('top','0px');
	}

});






