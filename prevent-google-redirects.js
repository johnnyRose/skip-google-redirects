//console.log("here we are");

// try {
	// browser.webnavigation.onbeforenavigate.addlistener(function (details) {
		
		// console.log(details.url);
		
		// return {
			// redirecturl: "https://www.google.com"
		// };
		
	// }, { url: [ { urlcontains: "google.com" } ] });
// } catch (e) {
	// console.log(e.message);
// }
	

try {
	browser.webRequest.onBeforeRequest.addListener(function (details) {

		var parameter = 'url=';
		var startIndex = details.url.indexOf(parameter);
		var endIndex = details.url.indexOf('&', startIndex);

		if (startIndex !== -1) {
			var newUrl = decodeURIComponent(details.url.substring(startIndex + parameter.length, endIndex));
			
			browser.tabs.sendMessage(details.tabId, newUrl);
			
			return {
				cancel: true
			};
		}

	}, { urls: [
			//"*://*.google.com/*"
			"<all_urls>"
			] }, ["blocking"]);
} catch (e) {
	console.log(e.message);
}

console.log("2");

// var httpRequestObserver =
// {
  // observe: function(subject, topic, data)
  // {
	  // console.log("observing");
	  
    // if (topic == "http-on-modify-request") {
      // var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      // httpChannel.setRequestHeader("X-Hello", "World", false);
    // }
  // },

  // get observerService() {
    // return Cc["@mozilla.org/observer-service;1"]
                     // .getService(Ci.nsIObserverService);
  // },

  // register: function()
  // {
    // this.observerService.addObserver(this, "http-on-modify-request", false);
  // },

  // unregister: function()
  // {
    // this.observerService.removeObserver(this, "http-on-modify-request");
  // }
// };

// httpRequestObserver.register();
