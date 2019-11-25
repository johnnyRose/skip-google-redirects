
var parameters = [
    // The standard URL parameter when clicking a google search result.
    // Example: https://www.google.com/url?sa=t&rct=j&q=&esrc=s&url=https%3A%2F%2Fgithub.com%2F&usg=AOvVaw38IHvcyBra8HGhmSxvlCGw
    'url=',
    
    // When JavaScript is disabled: The "I'm Feeling Lucky" redirect page as well as the regular search result page.
    // Example: https://www.google.com/url?q=https://github.com/
    'q='
];

var mostRecentTab = null;
var mostRecentWindow = null;
var mostRecentlyFocusedWindowId = null;

browser.tabs.onCreated.addListener(function (tab) {
    mostRecentTab = tab;
});

browser.windows.onCreated.addListener(function (window) {
	mostRecentWindow = window;
});

browser.windows.onFocusChanged.addListener(function (windowId) {
	mostRecentlyFocusedWindowId = windowId;
});

browser.webRequest.onBeforeRequest.addListener(function (details) {
    
    var existingParameters = parameters
      .map(function (parameter) {
        return {
            parameter: parameter,
            index: details.url.indexOf(parameter)
        };
    }).filter(function (param) {
        return param.index !== -1;
    });
    
    if (existingParameters.length > 0) {
        var param = existingParameters[0];
        var newUrl = getTargetUrl(details, param);
        
        incrementCounter();
		
		var requestType = getRequestType(details, mostRecentTab);
		        
		if (requestType.tab || requestType.window) {
			// Handle new tab/window logic - update the newest tab's URL, because
			// redirecting below doesn't seem to work for some reason and
			// there is no content script injected into about: pages.
            browser.tabs.update(mostRecentTab.id, { url: newUrl });
		} else {
            browser.tabs.update(details.tabId, { url: newUrl });
        }
        
        mostRecentTab = null;
        mostRecentWindow = null;
        mostRecentlyFocusedWindowId = null;
        
        return {
            redirectUrl: newUrl
        };
    }

}, { urls: ["*://*.google.com/url?*"] }, ["blocking"]);

function getTargetUrl(details, param) {
	var startIndex = param.index + param.parameter.length;
	var endIndex = details.url.indexOf('&', startIndex);
	
	if (endIndex === -1) {
		endIndex = details.url.length;
	}
	
	return decodeURIComponent(details.url.substring(startIndex, endIndex));
}

function incrementCounter() {
    
    browser.storage.local
        .get("count")
        .then(function (result) {
            var count = (result && result.count) || 0;
            browser.storage.local.set({ count: count + 1 });
        });
}

function getRequestType(details, mostRecentTab) {
    
    var requestType = {
        tab: false,
        window: false
    };
    
    if (mostRecentTab !== null) {
        
        if (mostRecentTab.openerTabId !== details.tabId &&
            typeof(mostRecentTab.openerTabId) !== "undefined") {
            
            // New tab
            requestType.tab = true;
        } else if (mostRecentWindow !== null && 
            mostRecentWindow.id === mostRecentlyFocusedWindowId &&
            mostRecentWindow.windowId !== mostRecentTab.windowId) {
            
            // New window
            requestType.window = true;
        }
    }
    
    return requestType;
}
