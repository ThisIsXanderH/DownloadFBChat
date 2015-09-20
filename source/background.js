// JavaScript Document

/*
//NOTE: Below are all classes
//NOTE: Background image of _4yp9 for sent images, 
//NOTE: uiList _2ne _4kg is list for messages. Each message is <li> child
//NOTE: _7hy for load more messages <-- document.querySelector('._7hy').click(); <!-- NOTE: This comes BEFORE the <ul>. It is a span.
//_7hx for "loading messages"
//NOTE: _2n3 (li class) is dates, but says "Conversation started August 6, 2011" (or whatever date) when you've reached the very top
*/


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
	if(tab.url.match(/*://*.facebook.com/messages/*/)) {
		console.log(tab.url);
		called = true;
		chrome.tabs.executeScript(null, {file: "jquery-1.11.3.min.js"}, function() {
			chrome.tabs.executeScript(null, {file: "main.js"});
		});
	}
});
