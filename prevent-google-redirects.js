
try {
	browser.webRequest.onBeforeRequest.addListener(function (details) {

		var parameter = 'url=';
		var startIndex = details.url.indexOf(parameter);
		var endIndex = details.url.indexOf('&', startIndex);

		if (startIndex !== -1) {
			var newUrl = decodeURIComponent(details.url.substring(startIndex + parameter.length, endIndex));
			
			browser.tabs.sendMessage(details.tabId, newUrl);
			
			return {
				redirectUrl: newUrl
			};
		}

	}, { urls: ["*://*.google.com/url?*"] }, ["blocking"]);
} catch (e) {
	console.log(e.message);
}
