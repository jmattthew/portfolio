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
	const caseStudyHubsAutomationDec = await decryptData(caseStudyHubsAutomationEnc, pw);
	if(caseStudyHubsAutomationDec) {
		decryptedCount++;
		$('#case_study_Hubs_platform_container').html(caseStudyHubsAutomationDec);
	}

	// 1
	const detailsHubsDesign1Dec = await decryptData(detailsHubsDesign1Enc, pw);
	if(detailsHubsDesign1Dec) {
		decryptedCount++;
		id = 'img_Hubs_design_1';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsDesign1Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	// 2
	const detailsHubsDesign2Dec = await decryptData(detailsHubsDesign2Enc, pw);
	if(detailsHubsDesign2Dec) {
		decryptedCount++;
		id = 'img_Hubs_design_2';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsDesign2Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	// 3
	const detailsHubsDesign3Dec = await decryptData(detailsHubsDesign3Enc, pw);
	if(detailsHubsDesign3Dec) {
		decryptedCount++;
		id = 'img_Hubs_design_2';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsDesign3Dec;
		img.alt = $('#'+id).attr('alt2');
		$('#'+id).prepend($(img));
	}

	// 4
	const detailsHubsResearch1Dec = await decryptData(detailsHubsResearch1Enc, pw);
	if(detailsHubsResearch1Dec) {
		decryptedCount++;
		id = 'img_Hubs_research_1';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsResearch1Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	// 5
	const detailsHubsResearch2Dec = await decryptData(detailsHubsResearch2Enc, pw);
	if(detailsHubsResearch2Dec) {
		decryptedCount++;
		id = 'img_Hubs_research_2';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsResearch2Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	// 6
	const detailsHubsResearch3Dec = await decryptData(detailsHubsResearch3Enc, pw);
	if(detailsHubsResearch3Dec) {
		decryptedCount++;
		id = 'img_Hubs_research_3';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsResearch3Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	// 7
	const detailsHubsResearch4Dec = await decryptData(detailsHubsResearch4Enc, pw);
	if(detailsHubsResearch4Dec) {
		decryptedCount++;
		id = 'img_Hubs_research_4';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsResearch4Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	// 8
	const detailsHubsLeadership1Dec = await decryptData(detailsHubsLeadership1Enc, pw);
	if(detailsHubsLeadership1Dec) {
		decryptedCount++;
		id = 'img_Hubs_leadership_1';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsLeadership1Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	// 9
	const detailsHubsLeadership2Dec = await decryptData(detailsHubsLeadership2Enc, pw);
	if(detailsHubsLeadership2Dec) {
		decryptedCount++;
		id = 'img_Hubs_leadership_2';
		$float.attr('id',id);
		var img = new Image();
		img.src = 'data:image/webp;base64' + detailsHubsLeadership2Dec;
		img.alt = $('#'+id).attr('alt1');
		$('#'+id).prepend($(img));
	}

	if(decryptedCount<10 && pwEntryType == 'manual') {
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

function chatWithLLM(elementId) {
	const element = document.getElementById(elementId);
	if (!element) {
		console.error(`Element with ID "${elementId}" not found.`);
		return;
	}

	function processNode(node) {
		let markdownText = '';
		if (node.nodeType === Node.ELEMENT_NODE) {
			const tagName = node.tagName.toLowerCase();
			const ignore = node.classList.contains('ignore_me');
			if(!ignore) {
				switch (tagName) {
					case 'h1':
						markdownText += `# ${node.textContent.trim()}\n\n`;
						break;
					case 'h2':
						markdownText += `## ${node.textContent.trim()}\n\n`;
						break;
					case 'h3':
						markdownText += `### ${node.textContent.trim()}\n\n`;
						break;
					case 'h4':
						markdownText += `#### ${node.textContent.trim()}\n\n`;
						break;
					case 'h5':
						markdownText += `##### ${node.textContent.trim()}\n\n`;
						break;
					case 'h6':
						markdownText += `###### ${node.textContent.trim()}\n\n`;
						break;
					case 'strong':
						markdownText += ` **${node.textContent.trim()}** `;
						break;
					case 'em':
						markdownText += ` *${node.textContent.trim()}* `;
						break;
					case 'q':
						markdownText += ` "${node.textContent.trim()}" `;
						break;
					case 'img':
						const altText = node.getAttribute('alt') || 'no alt text provided';
						markdownText += `an image of: ${altText}\n\n`;
						break;
					case 'div':
						// Recursively process children
						for (const childNode of node.childNodes) {
							markdownText += processNode(childNode);
						}
						break;
					case 'span':
						// Recursively process children
						for (const childNode of node.childNodes) {
							markdownText += processNode(childNode);
						}
						break;
					case 'p':
						// Recursively process children
						for (const childNode of node.childNodes) {
							markdownText += processNode(childNode);
						}
						break;
					default:
						// ignore content of other tags
						break;
				}
			} else {
				markdownText += `\n`;
			}
		} else if (node.nodeType === Node.TEXT_NODE) {
			markdownText += node.textContent.trim();
		}
		return markdownText;
	}

	const preamble =
		`Below are several impressive product design case studies written by an expert designer, Joseph, who has over twenty years of experience and is highly regarded.  Please answer my questions about these case studies with polite enthusiasm 😊.\n\n# Start of case studies\n\n`

	const postamble = `\n\n# End of case studies\n\nIn your next response, please say, \n\n"What would you like to know?  You can just type 'usability', 'research', 'strategy' etc., and I'll give you highlights from relevant parts of these case studies."`;

	const markdownContent = preamble + processNode(element) + postamble;

	navigator.clipboard.writeText(markdownContent)
		.then(() => {
			window.alert(`My porfolio has been copied to your clipboard in a text-only format along with LLM instructions.  Just open your preferred LLM and paste!`)
		})
		.catch(err => {
			window.alert(`I'm sorry, your clipboard couldn't be accessed.  But you can still get good results by selecting everything on this page, then paste it into your preferred LLM.`)
		});
}

var timer = null;
bindEvents();
if (location.hash) {
	highlightNav(location.hash);
}
setUpAnim();
setTimeout(afterRender, 100);
