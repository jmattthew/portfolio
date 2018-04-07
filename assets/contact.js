function storeValidationStatus() {
	// the validation status of each field and the form itself
	// are stored as $.data.  This sets the intial status
	$('#contact_form').data('allFieldsValid',false);
	$('.field').data('isValid',false);
	$('.field.optional').data('isValid',true);
	$('#field_submitter').data('isValid',true);
}

function createTabIndex() {
	// add a tabindex attribute to all form elements
	var tabIndex = 1;
	$('.field').each(function() {
		if($(this).attr('id')=='field_submitter') {
			// submit button:  tabindex goes on the link
			$(this).attr('tabindex',tabIndex);
		} else {
			// text fields and text area:  tabindex goes on the input as expected
			$(this).find('input').attr('tabindex',tabIndex);
			$(this).find('textarea').attr('tabindex',tabIndex);
		}
		tabIndex++;
	});
}

function giveFocusFeedback(input) {
	$(input).attr('placeholder','');
	var field = $(input).parent();
	$(field).removeClass('initial');
	$(field).addClass('focused');
}

function giveblurFeedback(input) {
	var field = $(input).parent();
	var label = $(field).find('label');
	$(field).removeClass('focused');
	setTimeout(function() {
		if(!$(field).hasClass('error')) {
			// this delay is needed to give time for
			// error label to be applied
			if($(input).val()=='') {
				$(field).addClass('initial');
			} else {
				$(label).html($(label).attr('initialLabel'));
			}
		}
	},100);
}

function returnSubmitToInitial() {
	var isValid = $('#contact_form').data('allFieldsValid');
	if(isValid) {
		$('#field_submitter').addClass('initial');
		$('#field_submitter').removeClass('error');
	}
}

function giveKeyupFeedback(field) {
	if($(field).data('isValid')) {
		$(field).removeClass('focused');
		$(field).addClass('valid');
		$(field).removeClass('error');
		$(field).find('LABEL').html($(field).find('LABEL').attr('initialLabel'));
	} else {
		$(field).addClass('focused');
		$(field).removeClass('valid');
		$(field).removeClass('error');
	}
	returnSubmitToInitial();
}

function giveTextareaLengthFeedback(area) {
	// prevents input text from overlapping the label
	if($(area)[0].scrollHeight > $(area).outerHeight() + 15) {
		$(area).parent().addClass('longInput');
	} else {
		$(area).parent().removeClass('longInput');
	}
}

function giveSubmitFeedback(event) {
	event.preventDefault();
	$('#field_submitter').blur();
	if($('#contact_form').data('allFieldsValid')) {
		ajaxSubmit();
	} else {
		$('#field_submitter').addClass('error');
		// error feedback animates from bottom to top
		$($('.field').get().reverse()).each(function(index) {
			var field = $(this);
			var label = $(field).find('LABEL');
			var input = $(field).find('INPUT, TEXTAREA');
			var parent = $(field).parent();
			if(!$(field).data('isValid')) {
				// leave valid fields unchanged
				$(field).removeClass('initial');
				$(field).addClass('error');
				$(input).attr('placeholder',$(label).attr('initialLabel'));
				// optional fields and checkboxes
				// will not be changed because they
				// don't have an 'errorLabel' attribute
				$(label).html($(label).attr('errorLabel'));
			}
		});
	}
}

function ajaxSubmit() {
	var action = $('#contact_form').attr('action');
	var method = $('#contact_form').attr('method');
	var fieldData = {
		'email' : $('#field_email input').val(),
		'message' : $('#field_message textarea').val()
	};
	$.ajax({
		type : method,
		url : action,
		data : fieldData,
		dataType : 'html',
	}).done(function(response) {
		sendGaEvent('forward','contact submit','success');
		doSendAnimation();
	}).fail(function(jqXHR, textStatus, errorThrown) {
		sendGaEvent('forward','contact submit','fail');
		console.log('fail');
		alert('Sorry, I couldn\'t reach the server to send your message.  Please refresh the page and try again.  I saw the error message:\n' + errorThrown);
	});
}

function doSendAnimation() {
	var s, $outro, $submitter, top, left, size, y, x;

	$submitter = $('#field_submitter svg');
	$submitter.css('transform','none');
	top = $submitter.offset().top;
	left = $submitter.offset().left;
	size = $submitter.width();
	$outro = $submitter.clone();
	$outro.attr('id','contact_outro_svg');
	$outro.css({
		'top' : top,
		'left' : left,
		'width' : size,
		'height' : size
	});
	shadow.$el = $outro;
	$('#contact').append($outro);
	$submitter.css('display','none');

	// animate
	size = $(window).width() < $(window).height() ? $(window).width() : $(window).height();
	size *= (1/2);
	x = (left-(($(window).width() - size)/2))*-1;
	y = (top-(($(window).height() - size)/2))*-1;
	s = 1;
	$('#contact .content').css('overflow','hidden');
	TweenMax.to('#contact .content', s*0.5, {
		delay : s*0.25,
		'opacity' : 0
	})
	TweenMax.to(shadow, s*1, {
		delay : s*0.25,
		ease : Power4.easeOut,
		y : size/3,
		r : size/25,
		onUpdate : applyShadow,
	});
	TweenMax.to($outro, s*1, {
		delay : s*0.25,
		ease : Power4.easeOut,
		y : y,
		x : x,
		'width' : size,
		'height' : size,
	});
	TweenMax.to($outro, s*0.75, {
		delay : s*0.5,
		ease : Power1.easeOut,
		skewY : 20,
		scaleY : 1.2,
	})

	tl1 = new TimelineMax({
		delay : 1.75,
		onComplete : function() {
			page = 'stack';
			$outro.remove();
			$submitter.attr('style','');
			resetContactForm();
			hideStack();
			showStackButton();
			expandNavigation();
			hidePage('contact');
		}
	});
	tl1
		.to($outro, s*0.2, {
			ease : Power1.easeIn,
			skewY : 0,
			scaleY : 1
		})
		.to($outro, s*0.5, {
			ease : Power2.easeIn,
			x : x + (size*1.5),
			y : y - (size*1.5),
		},'-=0.25');
	;
}

function applyShadow() {
	var y = shadow.y;
	var r = shadow.r;
	var $el = shadow.$el;
	$el.css('filter','drop-shadow('+(y/8)+'px '+y+'px '+r+'px rgba(0,0,0,0.5)');
}

function resetContactForm() {
	$('#contact_form')[0].reset();
	$('.field').addClass('initial');
	$('.field').removeClass('valid');
	storeValidationStatus();
}

function ignoreCode(code) {
	// in order to preserve the user's cursor position
	// don't perform validation/formatting on keyup for:
	// left, up, right, down, shift, ctrl, alt, cmd/windows
	var ignoredCodes = [37,38,39,40,16,17,18,91,93];
	var ignore = false;
	for(i=0,il=ignoredCodes.length;i<il;i++) {
		if (code == ignoredCodes[i]) {
			ignore = true;
			break;
		}
	}
	return ignore;
}

function validateEmail(input) {
	var isValid = false;
	var field = $(input).parent();
	// valid if it has onw @ symbol with
	// at least 2 characters on each side
	var parts = $(input).val().split('@');
	var count = 0;
	for(i=0,il=parts.length;i<il;i++) {
		if(parts[i].length>=2) {
			count++;
		}
	}
	if(count==2) {
		isValid = true;
	}
	$(field).data('isValid',isValid);
}

function validateMessage(area) {
	var isValid = false;
	var field = $(area).parent();
	// is valid if it has at least two words
	// remove starting whitespace
	$(area).val($(area).val().replace(/^\s/g,''));
	// check for at least two words of at least 2 letters
	var words = $(area).val().split(' ');
	var count = 0;
	for(i=0,il=words.length;i<il;i++) {
		if(words[i].length>=2) {
			count++;
		}
	}
	if(count>=2) {
		isValid = true;
 	}
	$(field).data('isValid',isValid);
}

function validateForm() {
	var isValid = true;
	$('.field').each(function() {
		var field = $(this);
		if(!$(field).data('isValid')) {
			isValid = false;
		}
	});
	$('#contact_form').data('allFieldsValid',isValid);
}

function bindContactEvents() {
	$('#field_email INPUT').keyup(function(event) {
		if(!ignoreCode(event.which)) {
			validateEmail(this);
		}
	});
	$('#field_message textarea').keyup(function(event) {
		if(!ignoreCode(event.which)) {
			validateMessage(this);
		}
	});
	// bind feedback events (i.e. change visual appearance)
	// feedback binding must happen after validation bindings
	$('.field INPUT, .field TEXTAREA').focus(function() {
		giveFocusFeedback(this);
	});
	$('.field INPUT, .field TEXTAREA').blur(function() {
		giveblurFeedback(this);
	});
	$('.field INPUT').keyup(function(event) {
		validateForm();
		if(!ignoreCode(event.which)) {
			giveKeyupFeedback($(this).parent());
		}
	});
	$('.field TEXTAREA').keyup(function(event) {
		validateForm();
		if(!ignoreCode(event.which)) {
			giveKeyupFeedback($(this).parent());
			giveTextareaLengthFeedback($(this));
		}
	});
	$('#field_submitter').click(function(event) {
		giveSubmitFeedback(event);
	});
	$('.field').click(function() {
		// make sure form element A tags don't scroll the page
		return false;
	});
}

bindContactEvents();
storeValidationStatus();
createTabIndex();
