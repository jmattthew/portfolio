var phoneAspect = 0.47246558197747; // aspect ratio of the phone frames
var screenHeight = 0.684; // screen height relative to phone height
var screenTop = 0.174; // screen top position relative to phone height
var screenLeft = 0.079; // screen left position relative to phone width
var screenAspect = 0.58394160583942; // aspect ratio of phones' virtual screen
var rtmWidth = 320; // best width for RT mobile site
var protoWidth = 640; // best width for prototype site
var rtButtonSize = 0.185; // home button width & height relative to phone width 
var rtButtonLeft = 0.409; // home button left poistion relative to phone width
var rtButtonTop = 0.884; //  home button top poistion relative to phone height

$(document).ready(function() {

	// call resize after browser window resizing has stopped
    $(window).resize(function() {
		if(!Modernizr.touch) {
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {
				resize();
			}, 500));
		}
	});

	function resize() {
		// scale and position the "phones"
		var docWidth = $(window).width();
		var docHeight = $(window).height(); 
		if(docWidth > docHeight) {
			// landscape mode
			$('.panel').css('width','50%');
			$('#prototype > DIV').css('float','right');
			$('#prototype > DIV').css('margin','0% 10% 0% 0%');
			$('#live_site > DIV').css('float','left');
			$('#live_site > DIV').css('margin','0% 0% 0% 10%');
		} else {
			// portrait mode
			$('.panel').css('width','100%');
			$('#prototype > DIV').css('float','none');
			$('#prototype > DIV').css('margin','0% auto');
			$('#live_site > DIV').css('float','none');
			$('#live_site > DIV').css('margin','0% auto');
		}

		var pH = Math.round(docHeight-50);
		var pW = Math.round(pH * phoneAspect);
		var sT = Math.round(pH * screenTop);
		var sL = Math.round(pW * screenLeft);
		var sH = Math.round(pH * screenHeight);
		var sW = Math.round(sH * screenAspect);
		$('.title, .phone').css('width', pW + 'px');
		$('.phone').css('height', pH + 'px');

		// scale and position the prototype "screen"
		var protoHeight = protoWidth/screenAspect;
		var protoScale = sW/protoWidth;
		var protosT = sT - (protoHeight-(protoHeight*protoScale))/2;
		var protosL = sL - (protoWidth-(protoWidth*protoScale))/2;
		var protoShieldT = protosT-protoHeight;

		$('#proto_screen').css('top', protosT + 'px');	
		$('#proto_shield').css('top', protoShieldT + 'px');
		$('#proto_screen, #proto_shield').css('left', protosL + 'px');		
		$('#proto_screen, #proto_shield').css('width', protoWidth + 'px');
		$('#proto_screen, #proto_shield').css('height', protoHeight + 'px');
		$('#proto_screen, #proto_shield').css('transform', 'scale(' + protoScale + ')');

		// scale and position the rtm "screen"
		var rtmHeight = rtmWidth/screenAspect;
		var rtmScale = sW/rtmWidth;
		var rtsT = sT - (rtmHeight-(rtmHeight*rtmScale))/2;
		var rtsL = sL - (rtmWidth-(rtmWidth*rtmScale))/2;
		var rtmShieldT = rtsT-rtmHeight;

		$('#rt_screen').css('top', rtsT + 'px');
		$('#rt_shield').css('top', rtmShieldT + 'px');
		$('#rt_screen, #rt_shield').css('left', rtsL + 'px');
		$('#rt_screen, #rt_shield').css('width', rtmWidth + 'px');
		$('#rt_screen, #rt_shield').css('height', rtmHeight + 'px');
		$('#rt_screen, #rt_shield').css('transform', 'scale(' + rtmScale + ')');

		var bW = pW*rtButtonSize;
		var bT = pH*rtButtonTop;
		var bL = pW*rtButtonLeft;
		var bMb = bW*-1;

		$('#rt_home_button').css('top', bT + 'px');	
		$('#rt_home_button').css('left', bL + 'px');	
		$('#rt_home_button').css('width', bW + 'px');	
		$('#rt_home_button').css('height', bW + 'px');	
		$('#rt_home_button').css('margin-bottom', bMb + 'px');	

	}

	$('#rt_shield, #proto_shield').mouseover(function(){
		$(this).animate({ opacity: 1}, { duration: 250 });
		$(this).unbind('mouseover');
	});

	$('#rt_shield, #proto_shield').click(function(){
		$(this).css('display','none');
		return false;
	});

	$('#rt_home_button').click(function(){
		$('#rt_screen').attr('src','https://www.rottentomatoes.com/mobile/m/her');
		return false;
	});

	// GO!
	resize();

});




