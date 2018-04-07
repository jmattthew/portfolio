$(window).load(function() {

	// GLOBAL VARIABLES
	var middleHeight = 0;
	var itemRowHeight = $('#item_list LI').eq(0).outerHeight();
	var itemInfoHeight = 0;
	var defaultTopHeight = $('#top').outerHeight();
	var defaultBottomHeight = $('#bottom').outerHeight();
	var defaultInfoHeight = $('#item_info_container').outerHeight();
	var firstItem = 0;
	var preventAutoScroll = false;

	function addMovieItemRows() {
		// set container height
		middleHeight = $('BODY').outerHeight();
		middleHeight -= $('#top').outerHeight(); 
		middleHeight -= $('#bottom').outerHeight(); 
		// dirty hack to make size right
		// but it's okay to be too tall
		middleHeight += 5;

		$('#middle').css('height',middleHeight);
	
		// add empty rows to top
		var count = 1;
		var emptyRows = Math.round((middleHeight/itemRowHeight)/2);
		for(var i=0; i<emptyRows-1; i++) {
			var el = $('#item_list LI').eq(0).clone();
			$(el).attr('id','item_' + count);
			$(el).find('A').removeAttr('href');
			$(el).find('.list_item_score').css('background','none');
			$(el).addClass('empty');
			$(el).appendTo('#item_list UL');
			count++;
		}

		firstItem = count;

		// add rows from movieArray and set attributes
		for(var i=0, il=movieArray.length; i<il; i++) {
			var el = $('#item_list LI').eq(0).clone();
			$(el).attr('id','item_' + count);
			$(el).appendTo('#item_list UL');
			$(el).find('.list_item_title').html(movieArray[i][1]);
			num = parseInt(movieArray[i][3]);
			if(num<56) {
				$(el).find('.list_item_score').removeClass('fresh');
				$(el).find('.list_item_score').addClass('splat');
			} else {
				$(el).find('.list_item_score').addClass('fresh');
				$(el).find('.list_item_score').removeClass('splat');
			}
			count++;
		}

		// add empty rows to bottom
		for(var i=0; i<emptyRows; i++) {
			var el = $('#item_list LI').eq(0).clone();
			$(el).attr('id','item_' + count);
			$(el).find('A').removeAttr('href');
			$(el).addClass('empty');
			$(el).find('.list_item_score').css('background','none');
			$(el).appendTo('#item_list UL');
			count++;
		}

		// 
		$('#item_list LI').eq(0).find('A').removeAttr('href');
		$('#item_list LI').eq(0).addClass('empty');
		$('#item_list LI').eq(0).find('.list_item_score').css('background','none');

		// stripe rows
		for(var i=0, il=$('#item_list LI').length; i<il; i++) {
			if(i%2==1) {
				$('#item_list LI').eq(i).find('A').addClass('even');
			}
		}

		// highlight and position center row
		var num = Math.round((middleHeight/itemRowHeight)/2);
		$('#item_list LI').eq(num).addClass('selected');
		finishScroll();
	}

	function addMovieInfoRows() {
		// add rows from movieArray and set attributes
		$('#item_info_0').attr('id','item_info_' + firstItem);
		for(var i=0, il=movieArray.length; i<il; i++) {
			// insert clone
			var id = firstItem + i
			var el = {};
			if(i>0) {
				el = $('#item_info_' + firstItem).clone();
				$(el).attr('id','item_info_' + id);
				$(el).appendTo('#item_info_container');
			}
			// set attributes
			el = $('#item_info_'+id);
			$(el).find('.tomato_score').html(movieArray[i][3] + '%');
			var num = parseInt(movieArray[i][3]);
			if(num>89) {
				$(el).find('.tomato_meter').addClass('certified');
				$(el).find('.tomato_meter').removeClass('fresh');
				$(el).find('.tomato_meter').removeClass('splat');
			} else if(num<56) {
				$(el).find('.tomato_meter').removeClass('certified');
				$(el).find('.tomato_meter').removeClass('fresh');
				$(el).find('.tomato_meter').addClass('splat');
			} else {
				$(el).find('.tomato_meter').removeClass('certified');
				$(el).find('.tomato_meter').addClass('fresh');
				$(el).find('.tomato_meter').removeClass('splat');
			}
			$(el).find('.item_poster').css('background-image','url(\'assets/' + movieArray[i][2] + '\')');
			// height of stars
			num = defaultInfoHeight-((num/100)*defaultInfoHeight);
			$(el).find('.item_stars_average').css('margin-top',num+'px');
			$(el).find('.item_stars_average').css('background-position','0px -'+num+'px');
		}
		itemInfoHeight = $('#item_info_'+firstItem).outerHeight();
	}

	function addCriticRows() {
		var el = {};
		for(var i=0, il=criticArray.length; i<il; i++) {
			if(i>0) {
				el = $('#review_0').clone();
				$(el).attr('id','review_' + i);
				$(el).appendTo('#reviews_container');			
			}
			// set attributes
			el = $('#review_'+i);
			var rating = Math.random();
			if(rating>0.8) {
				$(el).find('.critic_meter').addClass('splat');
			}
			$(el).find('.critic_name').html(criticArray[i]);
			if(i%2==1) {
				$(el).addClass('even');
			}
		}
		// write blurbs
		for(var i=0, il=criticArray.length; i<il; i++) {
			el = $('#review_'+i);
			var blurb = $(el).find('.review_blurb').html();
			blurb = blurb.substring(Math.round(Math.random()*20),Math.round((Math.random()*200)+40));
			$(el).find('.review_blurb').html(blurb);
		}
	}

	function doTallView(section) {
		preventAutoScroll = true;
		$('#item_list').css('overflow','hidden');
		var num = $('BODY').outerHeight();
		num -= $('#top').outerHeight();
		num -= $('#item_score_sort').outerHeight();
		num -= $('#nav_item').outerHeight();

		var ms = 300;
		var ease = 'easeInQuart'

		$('#middle').animate({
			height: num
		},{
			duration: ms,
			easing: ease 
		});	

		$('#item_list_pointer').animate({ 
			opacity: 0
		},{
			duration: ms,
			easing: ease 
		});	

		$('#item_info_container').animate({ 
			height: 0
		},{
			duration: ms,
			easing: ease 
		});	

		$('#item_shadow_left').animate({ 
			height: 0,
			marginTop: 0
		},{
			duration: ms,
			easing: ease 
		});	

		$('#item_shadow_right').animate({ 
			height: 0,
			marginTop: 0
		},{
			duration: ms,
			easing: ease
		}).promise().done(function() {
			ms = 600;
			ease = 'easeOutCubic';
			var id = $('#item_list .selected').attr('id');
			num = parseInt(id.substring(5,id.length));
			var titleH = $('#item_list .selected').outerHeight();
			var scroll = num*itemRowHeight;
			var num = $('BODY').outerHeight();
			num -= 70;
			num -= titleH;
			num -= $('#item_score_sort').outerHeight();
			num -= $('#nav_item').outerHeight();

			$('#top').delay(250).animate({ 
				height: 70
			},{
				duration: ms,
				easing: ease 
			});	

			$('#item_list').delay(250).animate({ 
				scrollTop: scroll + 'px'
			},{
				duration: ms,
				easing: ease 
			});	

			$('#middle').animate({ 
				top: 70,
				height: titleH
			},{
				duration: ms,
				easing: ease 
			});	

			$('#item_list .selected').css('text-align','center');
			$('#bottom').css('border-top','none');
			$('#bottom').css('box-shadow','none');
			$('#top').css('box-shadow','none');
			$(section).css('overflow','auto');
			$(section).animate({ 
				height: num
			},{
				duration: ms,
				easing: ease 
			});	
		});
	}

	function doInfoView() {
		var num = $('BODY').outerHeight();
		num -= $('#top').outerHeight();
		num -= $('#item_score_sort').outerHeight();
		num -= $('#nav_item').outerHeight();

		var ms = 300;
		var ease = 'easeInCubic'

		$('#item_list .selected').css('text-align','');
		$('#bottom').css('border-top','');
		$('#bottom').css('box-shadow','');
		$('#top').css('box-shadow','');
		$('.section').css('overflow','');

		$('#middle').animate({ 
			height: num
		},{
			duration: ms,
			easing: ease 
		});	

		$('.section').animate({ 
			height: 0
		},{
			duration: ms,
			easing: ease 
		});	

		$('#item_list_pointer').animate({ 
			opacity: 1
		},{
			duration: ms,
			easing: ease 
		}).promise().done(function() {
			ms = 600;
			ease = 'easeOutQuad';
			num = $('BODY').outerHeight();
			num -= defaultTopHeight;
			num -= defaultBottomHeight;

			$('#top').animate({ 
				height: defaultTopHeight
			},{
				duration: ms,
				easing: ease 
			});	

			$('#middle').animate({
				top: 239, 
				height: num
			},{
				duration: ms,
				easing: ease 
			});	

			$('#item_info_container').animate({ 
				height: defaultInfoHeight
			},{
				duration: ms,
				easing: ease 
			});	

			$('#item_shadow_left').animate({ 
				height: defaultInfoHeight,
				marginTop: (defaultInfoHeight*-1)
			},{
				duration: ms,
				easing: ease 
			});	

			$('#item_shadow_right').animate({ 
				height: defaultInfoHeight,
				marginTop: (defaultInfoHeight*-1)
			},{
				duration: ms,
				easing: ease
			});	

			finishScroll();
		});	

		$('#item_list').css('overflow','auto');
		preventAutoScroll = false;
	}

	function showMore() {
		var ms = 250;
		var ease = 'easeInQuart'

		var num = $('BODY').outerHeight();
		num -= $('#top').outerHeight();
		$('#section_more').css('opacity','1');
		$('#section_more').css('height',num);

		$('#nav_sort_by').css('display','none');
		$('#bottom').css('overflow','hidden');
		$('#bottom').animate({
			height: 0
		},{
			duration: ms,
			easing: ease
		});

		num = $('BODY').outerHeight();
		num -= $('#top').outerHeight();
		$('#middle').animate({
			height: num
		},{
			duration: ms,
			easing: ease
		});

		var ease = 'easeOutQuad'
		$('#section_more').css('display','block');
		$('#section_more').animate({
			width: 100 + '%'
		},{
			duration: ms,
			easing: ease
		});
		// this gets set to hidden by width animate?
		$('#section_more').css('overflow','auto');

		$('#nav_more').css('display','block');
		$('#nav_more').css('top',$('#top').outerHeight()-2);
		$('#nav_more').css('height',num+2);
		$('#nav_more').delay(250).animate({
			width: 25 + '%'
		},{
			duration: ms,
			easing: ease
		});
	}

	function hideMore() {
		var ms = 250;
		var ease = 'easeOutQuad'

		$('#section_more').animate({
			opacity: 0
		},{
			duration: ms,
			easing: ease
		}).promise().done(function() {
			$('#section_more').css('width','0%');
		});

		$('#nav_more').animate({
			width: 0 + '%'
		},{
			duration: ms,
			easing: ease
		}).promise().done(function() {
			$('#nav_more').css('display','none');			
			$('#section_more').css('display','none');
		});

		$('#bottom').delay(100).animate({
			height: defaultBottomHeight
		},{
			duration: ms,
			easing: ease
		}).promise().done(function() {
			$('#nav_sort_by').css('display','block');
			$('#bottom').css('height','');
		});

		var num = $('BODY').outerHeight();
		num -= $('#top').outerHeight();
		num -= defaultBottomHeight;
		$('#middle').animate({
			height: num
		},{
			duration: ms,
			easing: ease
		});


	}

	function finishScroll() {
		// scroll item list
		// this causes scroll function to fire
		// which scrolls info container to match
		var id = $('#item_list .selected').attr('id');
		var num = parseInt(id.substring(5,id.length));
		var scroll = (num*itemRowHeight)-(middleHeight/2)+(itemRowHeight/2);
		$('#item_list').animate({ 
			scrollTop: scroll + 'px' 
		},{ 
			duration: 250, 
			easing: 'swing',
			complete: function() { 
				var id = $('#item_list .selected').attr('id');
				var num = parseInt(id.substring(5,id.length));
				num -= firstItem;
				var scroll = itemInfoHeight*num;
				$('#item_info_container').scrollTop(scroll);
			}
		});
	}

	function bindEvents() {

		// from top to bottom

		// logo
		$('#nav_logo').click(function() {
			doInfoView();
			return false;
		});

		// top primary navigation
		$('#nav_list_type').find('A').click(function() {
			var el = $('#nav_list_type').find('.selected')
			$(el).removeClass('selected');
			$(this).addClass('selected');
			if($(this).html().indexOf('Home')>-1 || $(this).html().indexOf('TV')>-1) {
				alert('The "Home" & "TV" sections would look the same as "In Theaters", but with different content.  Try clicking "More".');
				$(this).removeClass('selected');
				$(el).addClass('selected');
			} else if($(this).html().indexOf('More')>-1) {
				showMore();				
			} else if($(this).html().indexOf('Now In')>-1) {
				hideMore();				
			}
			return false;
		});

		// top sorting
		$('#nav_sort_by').click(function() {
			alert('Displays mobile "drop-down" list for selecting sort type, e.g. "Release Date" (feature not shown).');
			return false;
		});

		// top sorting
		$('#nav_sort_search').click(function() {
			alert('Displays mobile keyboard for entering search terms (feature not shown).');
			return false;
		});

		// movie list 
		$('#item_list').scroll(function() {
			if(!preventAutoScroll) {
				// find row currently at middle of item list 
				var num = (middleHeight/itemRowHeight)/2;
				var scroll = $('#item_list').scrollTop();
				num += (scroll-(itemRowHeight/2))/itemRowHeight;
				num = Math.round(num);

				if($('#item_list LI').eq(num).hasClass('empty')) {

				} else {
					// not an empty row, so highlight item
					$('#item_list .selected').removeClass('selected');
					$('#item_list LI').eq(num).addClass('selected');
					// match info container scroll to highlighted item
					var ratio = itemInfoHeight/itemRowHeight;
					scroll = (scroll*ratio)-(itemInfoHeight/2);
					$('#item_info_container').scrollTop(scroll);
				}

				clearTimeout($.data(this, 'scrollTimer'));

				// after scrolling ends
				// scroll row and info to final position
				$.data(this, 'scrollTimer', setTimeout(function() {
					finishScroll();
				}, 500));
			}
		});

		// movie list
		$('#item_list').find('A').click(function() {
			if($(this).attr('href') == '#' && !preventAutoScroll) {
				// scroll row to middle
				var id = $(this).parent().attr('id');
				var num = parseInt(id.substring(5,id.length));
				var scroll = (num*itemRowHeight)-(middleHeight/2)+(itemRowHeight/2);
				$('#item_list').animate({ 
					scrollTop: scroll + 'px' 
				},{
					duration: 250,
					easing: 'easeOutCubic' 
				});	
			}
			return false;
		});

		// items
		$('.item_details').find('A').click(function(){
			return false;
		});

		// critics
		$('.review_critic').find('A').click(function(){
			return false;
		});

		// bottom sorting
		$('#score_sort_by').click(function() {
			alert('Displays mobile "drop-down" list for selecting scoring type, e.g. "Audiences" (feature not shown).');
			return false;
		});

		// bottom navigation
		$('#nav_item').find('A').click(function() {
			var el = $('#nav_item').find('.selected')
			$(el).removeClass('selected');
			$(this).addClass('selected');
			var str = $(this).html();
			if(str.indexOf('Info')>-1) {
				doInfoView();
			} else if(str.indexOf('Reviews')>-1) {
				doTallView('#reviews_container');
			} else if(str.indexOf('See')>-1) {
				alert('This allows you to find showtimes for this film in your area (feature not shown).');
				$(this).removeClass('selected');
				$(el).addClass('selected');
			} else if(str.indexOf('Media')>-1) {
				alert('This displays the film\'s trailers, photos, etc. (feature not shown).');
				$(this).removeClass('selected');
				$(el).addClass('selected');
			} else if(str.indexOf('Rate')>-1) {
				alert('This allows you to rate this film (feature not shown).');
				$(this).removeClass('selected');
				$(el).addClass('selected');
			} else if(str.indexOf('&nbsp;')>-1) {
				alert('This saves this film to your "I want to watch" list (feature not shown).');
				$(this).removeClass('selected');
				$(el).addClass('selected');
			}
			return false;
		});

		// more section
		$('#nav_more').find('A').click(function() {
			alert('Only the "People" page of the "More" section is available in this prototype.');
		});
	}

	// GO!
	addMovieItemRows();
	addMovieInfoRows();
	addCriticRows();
	bindEvents();

});












