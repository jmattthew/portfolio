/**/
/****/
/******/
/********/
/* HANDLE PASSWORD PROTECTED CONTENT */

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
	var id = '';
	var $float = $('<div>');
	$float.addClass('float_box');
	// 0

	const caseStudyHubsPlatformDec = await decryptData(caseStudyHubsPlatformEnc, pw);
	if(caseStudyHubsPlatformDec) {
		decryptedCount++;
		$('#hubspot .case_study').html(caseStudyHubsPlatformDec);
	}
	// 1

	const detailsHubsExampleDec = await decryptData(detailsHubsExampleEnc, pw);
	if(detailsHubsExampleDec) {
		decryptedCount++;
		id = 'img_Hubs_example';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsHubsExampleDec;
		img.alt = '';
		$('#'+id).prepend($(img));
	}

	// 2

	if(decryptedCount<2 && pwEntryType == 'manual') {
		alert('Sorry, the password you entered was incorrect.  Please try again, or contact me for the password.');
	} else {
		localStorage.setItem('password',pw);
	}
}

$('#last_encrypted_file').on('load',function() {
	if(localStorage.getItem('password')) {
		var pw = localStorage.getItem('password');
		insertDecryptedContent(pw,'auto');
	}
});

/**/
/****/
/******/
/********/
/* OTHER FUNCTIONS */

function highlightNav(hash) {
	history.replaceState(undefined, undefined, hash);
	var $sections = $('#nav li a');
	for (i=0,il=$sections.length;i<il;i++) {
		var a = $sections.eq(i);
		if(a.attr('href')==hash) {
			a.addClass('selected');
		} else {
			a.removeClass('selected');
		}
	}
}

function bindEvents() {
	$('#enter_password').click(function() {
		var pw = window.prompt('Enter password:');
		insertDecryptedContent(pw,'manual');
		return false;
	});

	$('a').click(function() {
		var href = $(this).attr("href");
		var hash = href.substr(href.indexOf("#"));
		highlightNav(hash);
	});

	$('#content').scroll(function() {
		if(timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			var $pages = $('.page');
			for (i=0,il=$pages.length;i<il;i++) {
				var y = $pages.eq(i).offset().top;
				if(y > 100) break;
			}
			var id = $pages.eq(i-1).attr('id');
			highlightNav('#' + id);
		}, 150);
	})
}

function setUpAnim() {
	$('.nav_item').css('left',-150);
	$('.nav_item').css('opacity',0);
	$('#nav > ul').css('opacity',0)
}

function doNavAnim() {
	$('.nav_item').css('left',0);
	$('.nav_item').css('opacity',1);
	$('#nav > ul').css('opacity',1)
}

function afterRender() {
	/* wait for deferred styles to load, the scroll and animate */
	var el = document.getElementById('outer');
	var styles = getComputedStyle(el);
	if(styles.getPropertyValue('display') == 'flex') {
		if(location.hash) {
			location.href = location.hash;
		}
		doNavAnim();
	} else {
		setTimeout(afterRender, 100);
	}
}

var timer = null;
bindEvents();
if (location.hash) {
	highlightNav(location.hash);
}
setUpAnim();
setTimeout(afterRender, 100);
