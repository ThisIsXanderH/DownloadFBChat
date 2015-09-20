// JavaScript Document
/*
//NOTE: Below are all classes
//NOTE: Background image of _4yp9 for sent images, 
//NOTE: uiList _2ne _4kg is list for messages. Each message is <li> child. id = webMessengerRecentMessages
//NOTE: _7hy for load more messages <-- document.querySelector('._7hy').click(); <!-- NOTE: This comes BEFORE the <ul>. It is a span.
_7hy is display:inline before clicking, display:none after.
_7hx is opposite
ALTHOUGH: _7hy is display:inline before AND after clicking if there's no more content to load
//NOTE: _2n3 (li class) is dates, but says "Conversation started August 6, 2011" (or whatever date) when you've reached the very top
*/

//NOTE: Rarely, a duplicate line will be recorded. I do not know why. It is reproducable, on always the same lines.
//TODO: What happens when you receive a message in the middle of it all?

/* How are you going to do video? https://www.quora.com/What-do-the-OH-OE-and-GDA-fields-represent-in-Facebook-picture-URLs */
for(i=0;i<30;i++) {
	$('#webMessengerRecentMessages').unwrap();
}
$('body').children().each(function() {
    if($(this).hasClass('uiMorePager') || $(this).is('#webMessengerRecentMessages')) {
		
	} else {
		$(this).remove();
	}
});
$('#webMessengerRecentMessages').hide();

$('body').append('<div id="blockAll"><h1>Please Wait. </h1><h2><span id="numLoaded">0</span>%</h2> loaded in <h2 id="numTime">0</h2>Longer chats may slow down your computer.</div>');

$('#blockAll').css({
	'position':'fixed',
	'left':'0',
	'right':'0',
	'top':'0',
	'bottom':'0',
	'background-color':'white',
	'z-index':'1000',
	'text-align':'center',
	'padding-top':'100px'
	});
$('h1').css({
	'font-size':'72px'
});
$('h2').css({
	'font-size':'48px'
});
//*/

var startTime = Date.now();
var numMessages = 0;

var timestamps = [];
var persons = [];
var messages = [];
var messagesCSV = "TIMESTAMP,PERSON,MESSAGE \n";
var messagesHTML = "";

var totalMessageBlocks = parseInt($('._7hy').find('span').text());
//TODO: Images, video
function loadMore(state) {
	
	var totalTime = (Date.now() - startTime); 
	$('#numTime').text(time(totalTime));
	
	
	var showMore = document.querySelector("._7hy");
	before = $('._7hy').css('display');
	
	remainingMessageBlocks = parseInt($('._7hy').find('span').text());
	percentMessageBlocks = (100-(remainingMessageBlocks / totalMessageBlocks * 100));
	console.log(percentMessageBlocks);
	console.log(totalTime);
	if((percentMessageBlocks == 0)&&(totalTime>5000)) {
		alert("Something has gone wrong. Please wait for page to finish loading and try again.");
		location.reload();
	}
	if(state == before) {
		$('#numLoaded').text(percentMessageBlocks.toFixed(2));
		numMessages = $('#webMessengerRecentMessages').children().length;
		//$('#numLoaded').text(numMessages);
		/*$('.delete').each(function(index, element) {
			console.log($(this).html());
            $(this).empty();
			console.log("What the shit");
        });*/
		$($('#webMessengerRecentMessages').children().get().reverse()).each(function() { //Reverse is to maintain correct order
			var timestamp,
				person,
				message; //TODO: Escape this from :#:#. It will break the array otherwise. Similarly with HTML? Less of an issue, given .text();
				
			if($(this).hasClass('recorded')) {
				/*console.log("???");
				$(this).remove();*/
				//Already recorded
			} else if($(this).hasClass('webMessengerMessageGroup')) {
				timestamp = $(this).find('._35').data('utime');
				person = $('._2w7',this).find('img').attr('alt');
				//person = $('._36',this).find('a').text();
				$($('._38',this).get().reverse()).each(function() { //This is why it's going wrong. There's not this._38 or some such
					message = $(this)./*parent().*/find('span').html();
					if(message == undefined) {
						//Image
					} else {
						message = message.replace(/,/g,"&#44;");
						message = message.replace(/\n/g,"<br>");
						timestamps.push(timestamp);
						persons.push(person);
						messages.push(message);
					}
					$(this).empty(); //Clear message text for faster running
					/*messagesCSV += timestamp + "," + person + "," + message + " \n";
					messagesHTML += "<span title='" + timestamp + "'><b>" + person + "</b>" + message + "</span>";
					numMessages += 1;*/
				});
			} else if($(this).hasClass('_2n3')) {
				//Timestamp, in this format: <li class="_2n3"><abbr data-utime="0" class="timestamp" data-jsid="timestamp">Today</abbr></li>
			} else if($(this).hasClass('_8_')) {
				//Chat renamed
				//NOTE: This repeats in the HTML, for some reason.
				var hold = $(this).find('._42ef');
				timestamp = hold.find('abbr').data('utime');
				person = 'someone'; //The actual person is stored within the message
				
				message = hold.html(); //Hopefully third child, the correct span
				message = message.replace(/,/g,"&#44;");
				message = message.replace(/\n/g,"<br>");
				//TODO: Add more escape characters, to allow for more legal characters. Turn Newline into something else, comma into special code for that, & into special code for that.
				//alert(message);
				timestamps.push(timestamp);
				persons.push(person);
				messages.push(message);
				/*messagesCSV += timestamp + "," + person + "," + message + " \n";
				messagesHTML += "<span title='" + timestamp + "'><b>" + person + "</b>" + message + "</span>\n";
				numMessages += 1;*/
			} else {
				alert("Not webMessengerMessageGroup");
				alert($(this).attr('class'));
			}
			$(this).hide();
			$(this).addClass('recorded');
		});
		$('._50dv').remove(); //Remove profile pictures (for faster running)
		$('img').remove();
		//$('#webMessengerRecentMessages').empty();
		showMore.click();
		after = $('._7hy').css('display');
		if(before == after) {
			//No more loading needed
			$('#blockAll').html('<h1>All messages loaded. Stand by for formatting.</h1>');
			$('#webMessengerRecentMessages').remove();
			$.grep(messages,function(n,i) {
				if((n == "")||(n==" ")) {
					messages.splice(i,1);
					persons.splice(i,1);
					timestamps.splice(i,1);
				}
			});
			messages = messages.reverse();
			persons = persons.reverse();
			timestamps = timestamps.reverse();
			for(var i=0;i<messages.length;i++) {
				messagesCSV += timestamps[i] + "," + persons[i] + "," + messages[i] + " \n";
				messagesHTML += "<span title='" + timestamps[i] + "'><b>" + persons[i] + "</b>" + messages[i] + "</span>\n";
			}
			console.log("All loaded");
			numMessages = 0;
			
			console.log("Retrieved " + messages.length + " Messages in " + time(totalTime) + " seconds");
			$('#blockAll').html('Retrieved ' + messages.length + ' messages in ' + time(totalTime) + '<br><h2>CSV</h2><br><textarea id="outputCSV" class="select"></textarea><br><button class="select" data-partner="outputCSV">Select</button><br><br><br>HTML<br><textarea id="outputHTML" class="select"></textarea><br><button class="select" data-partner="outputHTML">Select</button>');
			$('#outputCSV').text(messagesCSV);
			$('#outputHTML').text(messagesHTML);
		} else {
			//Load again soon
			
			setTimeout(function() {loadMore(before)},500);
			
			//chrome.alarms.create("check",Date.now() + 1000);
		}
	} else {
		//Slow loading?
		setTimeout(function() {loadMore(state)},500);
	}
}
$(document).on("click",'.select',function() {
	$('#' + $(this).data('partner')).select();
});
loadMore("inline");
function time(s) {
	//http://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
	var plural = ['', ''];
	if (hrs != 1) {
		plural[0] = 's';
	}
	if (mins != 1) {
		plural[1] = 's';
	}
	
  return hrs + ' hour' + plural[0] + ', ' + mins + ' minute' + plural[1] + ', and ' + secs + '.' + ms + " seconds";
}
