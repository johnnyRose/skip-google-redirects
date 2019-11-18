
var parameters = [
    // The standard URL parameter when clicking a google search result.
    // Example: https://www.google.com/url?sa=t&rct=j&q=&esrc=s&url=https%3A%2F%2Fgithub.com%2F&usg=AOvVaw38IHvcyBra8HGhmSxvlCGw
    'url=',
    
    // When JavaScript is disabled: The "I'm Feeling Lucky" redirect page as well as the regular search result page.
    // Example: https://www.google.com/url?q=https://github.com/
    'q='
];

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
        
        var startIndex = param.index + param.parameter.length;
        var endIndex = details.url.indexOf('&', startIndex);
        
        if (endIndex === -1) {
            endIndex = details.url.length;
        }
        
        var newUrl = decodeURIComponent(details.url.substring(startIndex, endIndex));
        
        incrementCounter();
        
        browser.tabs.sendMessage(details.tabId, newUrl);
                
        return {
            redirectUrl: newUrl
        };
    }

}, { urls: ["*://*.google.com/url?*"] }, ["blocking"]);

function incrementCounter() {
    
    browser.storage.local
        .get("count")
        .then(function (result) {
            var count = (result && result.count) || 0;
            browser.storage.local.set({ count: count + 1 });
        });
}
