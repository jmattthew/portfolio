/**/
/****/
/******/
/********/
/**********/
/************/
/**************/
/****************/
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
	const caseStudySensDesignSystemDec = await decryptData(caseStudySensDesignSystemEnc, pw);
	if(caseStudySensDesignSystemDec) {
		decryptedCount++;
		$('#sense .case_study').html(caseStudySensDesignSystemDec);
	}
	// 1

	const detailsSensButtonsDec = await decryptData(detailsSensButtonsEnc, pw);
	if(detailsSensButtonsDec) {
		decryptedCount++;
		id = 'img_Sens_buttons';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/gif;base64,' + detailsSensButtonsDec;
		img.alt = '';
		$('#'+id).prepend($(img));
	}
	// 2

	const detailsSensColorsDec = await decryptData(detailsSensColorsEnc, pw);
	if(detailsSensColorsDec) {
		decryptedCount++;
		id = 'img_Sens_colors';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensColorsDec;
		img.alt = $('#'+id).attr('imgAlt1');
		$('#'+id).prepend($(img));
	}
	// 3

	const detailsSensCompsDec = await decryptData(detailsSensCompsEnc, pw);
	if(detailsSensCompsDec) {
		decryptedCount++;
		id = 'img_Sens_comps';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensCompsDec;
		img.alt = $('#'+id).attr('imgAlt1');
		$('#'+id).prepend($(img));
	}
	// 4

	const detailsSensFlowchartDec = await decryptData(detailsSensFlowchartEnc, pw);
	if(detailsSensFlowchartDec) {
		decryptedCount++;
		id = 'img_Sens_flowchart';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensFlowchartDec;
		img.alt = $('#'+id).attr('imgAlt1');
		$('#'+id).prepend($(img));
	}
	// 5

	const detailsSensMigrationDec = await decryptData(detailsSensMigrationEnc, pw);
	if(detailsSensMigrationDec) {
		decryptedCount++;
		id = 'img_Sens_migration';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensMigrationDec;
		img.alt = $('#'+id).attr('imgAlt1');
		$('#'+id).prepend($(img));
	}
	// 6

	const detailsSensSlidersDec = await decryptData(detailsSensSlidersEnc, pw);
	if(detailsSensSlidersDec) {
		decryptedCount++;
		id = 'img_Sens_sliders';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensSlidersDec;
		img.alt = $('#'+id).attr('imgAlt1');
		$('#'+id).prepend($(img));
	}
	// 7

	const detailsSensTable2Dec = await decryptData(detailsSensTable2Enc, pw);
	if(detailsSensTable2Dec) {
		decryptedCount++;
		id = 'img_Sens_table';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensTable2Dec;
		img.alt = $('#'+id).attr('imgAlt2');
		$('#'+id).prepend($(img));
	}
	// 8

	const detailsSensTable1Dec = await decryptData(detailsSensTable1Enc, pw);
	if(detailsSensTable1Dec) {
		decryptedCount++;
		id = 'img_Sens_table';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/png;base64,' + detailsSensTable1Dec;
		img.alt = $('#'+id).attr('imgAlt1');
		$('#'+id).prepend($(img));
	}
	// 8

	if(decryptedCount<9 && pwEntryType == 'manual') {
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

function bindEvents() {
	$('#enter_password').click(function() {
		var pw = window.prompt('Enter password:');
		insertDecryptedContent(pw,'manual');
		return false;
	});
}

bindEvents();