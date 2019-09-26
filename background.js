
var parameter = 'url=';

browser.webRequest.onBeforeRequest.addListener(function (details) {

	var paramStartIndex = details.url.indexOf(parameter);

	if (paramStartIndex !== -1) {
		
		var startIndex = paramStartIndex + parameter.length;
		var endIndex = details.url.indexOf('&', startIndex);
		var newUrl = decodeURIComponent(details.url.substring(startIndex, endIndex));
		
		browser.tabs.sendMessage(details.tabId, newUrl);
		
		return {
			redirectUrl: newUrl
		};
	}

}, { urls: ["*://*.google.com/url?*"] }, ["blocking"]);
