var rules;
var helpMessage = 1; // which message is showing
var helpMessages = 0; // will be updated after DOM load
var savedIntention = '';
var state = 'initial';

// elements to be animated
var help = '#help';
var bar = '#action_bar';
var card = '#intentions_card';
var wipe = '#intentions_wipe';
var actions = '#intentions_actions';
var label = '#intentions_label';
var input = '#intentions_input';

$(window).load(function() {

	// bind events
	$('#intentions_input').keyup(function(event) {
		toggleSaveAndLabel($(this).val());
		var code = event.keyCode || event.which;
		if(code == 13) {
			animateSave();
		}
	});

	$('#intentions_card').click(function() {
		if(state == 'initial') {
			animateActive();
		}
	});

	$('#intentions_input').focus(function() {
		showFakeKeyboard(true);
	});

	$('#intentions_input').blur(function() {
		showFakeKeyboard(false);
	});

	$('#fakeKeyboard, .button').click(function() {
		// prevents hiding of onscreen keyboard
		$('#intentions_input').focus();
	});

	$('#intentions_save').click(function() {
		animateSave();
	});

	$('#intentions_back').click(function() {
		event.stopPropagation();
		animateInitial();
	});

	helpMessages = $('.help_message').length;

	$('#help_back').click(function() {
		helpBack();
	});

	$('#help_next').click(function() {
		helpNext();
	});

	$('#help_gotit').click(function() {
		helpGotit();
	});

	$('#help_tips').click(function() {
		helpTips();
	});

});

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

function animateInitial() {

	state = 'initial';

	var tl1 = new TimelineLite();

	tl1
		.add(function(){
			$(input).removeClass('white');
			$(input).val(savedIntention);
			if(savedIntention.length > 0) {
				$(label).addClass('filled');
			} else {
				$(input).attr('placeholder',$(input).attr('initialPlaceholder'));
				$(label).html($(label).attr('initialLabel'));
			}
		})
		.to(card, 0, {
			'borderRadius' : 	CSSVal(card,state,'borderRadius'),
		})
		.to(card, 0.25, {
			ease : 				Expo.easeOut,
			'top' : 			CSSVal(card,state,'top'),
			'height' : 			CSSVal(card,state,'height'),
			'margin' : 			CSSVal(card,state,'margin'),
			'backgroundColor' : CSSVal(card,state,'backgroundColor')
		})
		.to(label, 0.25, {
			'ease' : 			Expo.easeOut,
			'marginTop' : 		CSSVal(label,state,'marginTop'),
			'marginLeft' : 		CSSVal(label,state,'marginLeft')
		},'-=+0.25')
		.to(input, 0.25, {
			'marginLeft' : 		CSSVal(input,state,'marginLeft'),
			'color' : 			CSSVal(input,state,'color')
		},'-=+0.25')
		.to(bar, 0.25, {
			'opacity' : 		CSSVal(bar,state,'opacity')
		},'-='+0.25)
		.to(help, 0.25, {
			'opacity' : 		CSSVal(help,state,'opacity')
		},'-=+0.25')
		.to(actions, 0.25, {
			'opacity' : 		CSSVal(actions,state,'opacity')
		},'-=+0.25')
		.add(function(){
			// clear all aninmated styles
			$(wipe)
				.add(card)
	    	    .add(input)
	    	    .add(label)
	    	    .add(bar)
	    	    .add(help)
	    	    .add(actions)
		        .attr('style','');
		},'+=0.25')
	;

}

function animateActive() {

	state = 'active';

	var tl1 = new TimelineLite();
	tl1
		.add(function(){
			$(input).addClass('white');
			$(input).attr('placeholder',$(input).attr('activePlaceholder'));
		},'+=0.25')
	;

	var tl2 = new TimelineLite();
	tl2
		.to(wipe, 0.5, {
			ease : 				Circ.easeIn,
			'width': 			CSSVal(wipe,state,'width'),
			'opacity': 			CSSVal(wipe,state,'opacity')
		})
		.to(card, 0, {
			'backgroundColor': 	CSSVal(card,state,'backgroundColor')
		})
		.to(input, 0.25, {
			'color': 			CSSVal(input,state,'color')
		},'-=0.5')
		.to(card, 0.5, {
			ease : 				Back.easeOut.config(1),
			'top' : 			CSSVal(card,state,'top'),
			'height' : 			CSSVal(card,state,'height'),
			'margin' : 			CSSVal(card,state,'margin')
		})
		.to(input, 0.5, {
			'marginLeft' : 		CSSVal(input,state,'marginLeft')
		},'-=0.5')
		.to(label, 0.5, {
			'marginTop' : 		CSSVal(label,state,'marginTop'),
			'marginLeft' : 		CSSVal(label,state,'marginLeft'),
			'opacity' : 		CSSVal(label,state,'opacity'),
			'color' : 			CSSVal(label,state,'color')
		},'-=0.5')
		.set(wipe,{
			clearProps : 'all'
		})
	;

	var tl3 = new TimelineLite();
	tl3
		.to(bar, 0.5, {
			'opacity' : 		CSSVal(bar,state,'opacity')
		},'+=0.5')
		.to(help, 0.5, {
			'opacity' : 		CSSVal(help,state,'opacity')
		},'-=0.5')
		.to(actions, 0.15, {
			'opacity' : 		CSSVal(actions,state,'opacity')
		},'-=0.15')
		.add(function(){
			$(input).prop('disabled', false);
			$(input).focus();
		})
		// elapsed : 1.00
	;

}

function animateSave() {

	state = 'save';

	var tl1 = new TimelineLite();
	tl1
		.add(function(){
			savedIntention = $(input).val();
			$(input).prop('disabled', true);
		})
		.to(help, 0, {
			'opacity' : 		CSSVal(help,state,'opacity')
		})
		.to(wipe, 0, {
			'backgroundColor' : CSSVal(wipe,state,'backgroundColor')
		})
		.to(card, 0.5, {
			ease : 				Back.easeInOut.config(2),
			'margin' : 			CSSVal(card,state,'margin'),
			'borderRadius' : 	CSSVal(card,state,'borderRadius'),
			'top' : 			CSSVal(card,state,'top')
		})
		.to(actions, 0.25, {
			'opacity' : 		CSSVal(actions,state,'opacity')
		},'-=0.25')
	;

	var tl2 = new TimelineLite();
	tl2
		.to(card, 2, {
			ease : 				Power4.easeInOut,
			'height' : 			CSSVal(card,state,'height')
		})
		.to(label, 1.5, {
			ease : 				Power2.easeOut,
			'marginTop' : 		CSSVal(label,state,'marginTop')
		},'-=1.0')
	;

	var tl3 = new TimelineLite();
	tl3
		.to(wipe, 0.5, {
			ease : 				Power2.easeOut,
			'width' : 			CSSVal(wipe,state,'width')
		},'+=2.75')
		.to(wipe, 0.375, {
			'opacity' : 		CSSVal(wipe,state,'opacity')
		},'-=0.375')
		.to(label, 0.375, {
			'color' : 			CSSVal(wipe,state,'color')
		},'-=0.375')
		.to(input, 0.375, {
			'color' : 			CSSVal(input,state,'color')
		},'-=0.25')
		.add(function(){
			animateInitial();
			helpGotit();
		})
	;

}

function toggleSaveAndLabel(intentionsInput) {
	if(intentionsInput.length > 0) {
		$('#intentions_save').removeClass('hidden');
		$('#intentions_label').html($('#intentions_label').attr('savedLabel'));
	} else {
		$('#intentions_save').addClass('hidden');
		$('#intentions_label').html($('#intentions_label').attr('initialLabel'));
	}
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

function helpBack() {
	if(helpMessage > 1) {
		helpMessage--;
		var w = $('#help_message_1').outerWidth();
		$('#help_message_1').css('margin-left',((helpMessage-1) * w* -1) + 'px');
		$('#help_message_indicator').html(helpMessage + ' of ' + helpMessages);
		$('.help_message, #help_gotit').addClass('hidden');
		$('#help_next, #help_message_' + helpMessage).removeClass('hidden');
	}
	if(helpMessage == 1) {
		$('#help_back').addClass('hidden');
	}
}

function helpNext() {
	if(helpMessage < helpMessages) {
		helpMessage++;
		var w = $('#help_message_1').outerWidth();
		$('#help_message_1').css('margin-left',((helpMessage-1) * w * -1) + 'px');
		$('#help_message_indicator').html(helpMessage + ' of ' + helpMessages);
		$('.help_message').addClass('hidden');
		$('#help_back, #help_message_' + helpMessage).removeClass('hidden');
	}
	if(helpMessage == helpMessages) {
		$('#help_next').addClass('hidden');
		$('#help_gotit').removeClass('hidden');
	}
}

function helpGotit() {
	helpMessage = 0;
	$('.help_message').addClass('hidden');
	$('#help_gotit, #help_back, #help_next, #help_message_indicator').addClass('hidden');
	$('#help_tips').removeClass('hidden');
	setTimeout(function() {
		$('#help_message_1').css('margin-left','');
	}, 500);
}

function helpTips() {
	helpMessage = 1;
	$('#help_message_indicator').html(helpMessage + ' of 4');
	$('.help_message, #help_tips').addClass('hidden');
	$('#help_message_1, #help_message_indicator, #help_next').removeClass('hidden');
}
