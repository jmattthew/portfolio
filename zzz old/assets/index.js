$(window).load(function() {

	// GLOBAL VARS
	var docHeight = $(window).height();
	var hasScrolled = false;
	var allowShardEdit = false;
	var shards = 1;
	var shardAngle = 2;
	var shardWidth = 40;
	var shardSpacing = 5;
	var headerTitle = 'Mattthew';
	var headerSubtitle = 'Tap on my name!';
	var wH = $(window).height();
	var cY = $('#caseStudies').offset().top + $('#caseStudies').height();
	var flip1Start =  1.80; // start white top to front
	var flip1End   =  1.10; // end white top to front
	var flip2Start =  0.90; // start front to color bottom
	var flip2End   =  0.50; // end front to color bottom

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
		if(allowShardEdit) {
			ga('send', 'event', {
				eventCategory: 'Screen Interaction',
				eventAction: 'click',
				eventLabel: 'shard'
			});
			$('#shardHolder').css('display','none');
			$('#shardSpacer').css('display','none');
			$('#shardEditor').css('display','block');
			$('#shardEditor').focus();
			$('#shardEditor')[0].setSelectionRange(0, $('#shardEditor')[0].value.length);
			$('#sectionHeader p span').css('top','25px');
			$('#sectionHeader p span').html('has great taste in designers!');
		}
		return false;
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
		ga('send', 'event', {
			eventCategory: 'Screen Interaction',
			eventAction: 'submit',
			eventLabel: 'shard: ' + el.value
		});
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

	$('.twitterLink').click(function() {
		ga('send', 'event', {
			eventCategory: 'Outbound Link',
			eventAction: 'click',
			eventLabel: 'https://twitter.com/mattthew'
		});
		$(this).attr('href','https://twitter.com/messages/compose?recipient_id=3084491');
	});

	function animateCubes() {
		var scroll = $(window).scrollTop();
		var r = (cY-scroll) / wH; // bottom edge of caseStudies (cY), position relative to window height
		for (var i = 1, il = 6; i <= il; i++) {
			var f1S = flip1Start - ((i-1)*0.07); // stagger rotation of cubes
			var f1E = flip1End - ((i-1)*0.07);
			var f2S = flip2Start - ((i-1)*0.07);
			var f2E = flip2End - ((i-1)*0.07);
			var el = "#c" + i;
			if(r > f1S) {
				// before flipping
				$(el + ' .cube').css('transform', '');
				$(el + ' .top').css('box-shadow', '0 -0.5vh 3vh rgba(0, 0, 0, 0.3)');
				$(el + ' .top').css('background', '');
				$(el + ' .front').css('box-shadow', '');
				$(el + ' .front').css('background', '');
			} else if(r <= f1S && r > f1E) {
				// flipping top to front
				var x = (r - f1S) / (f1E - f1S); // bottom  edgeof caseStudies relative to flipping range
				x = (1-x);
				$(el + ' .cube').css('transform', 'rotateX(' + x*-90 + 'deg)');
				$(el + ' .top').css('box-shadow', '0 -0.5vh '+(x*3)+'vh rgba(0, 0, 0, '+(x*.3)+')');
				$(el + ' .top').css('background', 'linear-gradient(to bottom, rgba(255, 255, 255, ' + x + ') 0%, rgb(255, 255, 255) 100%)');
				$(el + ' .front').css('box-shadow', '0 0.5vh '+(x*3)+'vh rgba(0, 0, 0, '+(x*.3)+')');
				var y = x*100;
				$(el + ' .front').css('background', 'linear-gradient(165deg, rgba(255, 255, 255, 0) '+
					(y-100)+'%, rgba(255, 255, 255, 0.3) '+(y-50)+'%, rgba(255, 255, 255, 0) '+(y)+'%)');
				if(x < 0.1 ) { // removes 1px artifact
					$(el + ' .top').css('visibility', 'hidden');
				} else {
					$(el + ' .top').css('visibility', 'visible');
				}
				$(el + ' .bottom').css('visibility', 'hidden');
			} else if (r <= f1E && r > f2S) {
				// faceing front
				$(el + ' .cube').css('transform', 'rotateX(0deg)');
				$(el + ' .face').css('box-shadow', '');
				$(el + ' .top').css('visibility', 'hidden');
				$(el + ' .bottom').css('visibility', 'hidden');
				$(el + ' .front').css('background', '');
			} else if (r <= f2S && r > f2E) {
				// flipping front to bottom
				var x = (r - f2S) / (f2E - f2S); // bottom of edge caseStudies relative to flipping range
				$(el + ' .cube').css('transform', 'rotateX(' + x*90 + 'deg)');
				$(el + ' .front').css('box-shadow', '0 -0.5vh '+(x*3)+'vh rgba(0, 0, 0, '+(x*.3)+')');
				$(el + ' .bottom').css('background', 'linear-gradient(to top, rgba(255, 255, 255, ' + x + ') 0%, rgb(255, 255, 255) 100%)');
				$(el + ' .bottom').css('box-shadow', '0 0.5vh '+(x*3)+'vh rgba(0, 0, 0, '+(x*.3)+')');
				if(x < 0.1 ) { // removes 1px artifact
					$(el + ' .bottom').css('visibility', 'hidden');
				} else {
					$(el + ' .bottom').css('visibility', 'visible');
				}
				$(el + ' .top').css('visibility', 'hidden');

			} else {
			}
		}
	}

    $(window).resize(function() {
		clearTimeout($.data(this, 'scrollTimer'));
		$.data(this, 'scrollTimer', setTimeout(function() {
			wH = $(window).height();
			cY = $('#caseStudies').offset().top + $('#caseStudies').height();
		}, 500));
	});

	$(window).scroll(function(event) {
		animateCubes();
	});

	// ACTION

	$('#sectionHeader').trigger('reveal');
	var animationTimer = window.setTimeout(function() {
		$('#shardHolder').trigger('bindEvents');
		$('#shardHolder').trigger('addShards');
		$('#shardHolder').trigger('addShardCSS');
		$('#shardHolder').trigger('dropShards');
	}, 800);

	var cubeTimer = window.setTimeout(function() {
		// delay needed because shard animation changes document height
		cY = $('#caseStudies').offset().top + $('#caseStudies').height();
	}, 800);

	animateCubes();

});






