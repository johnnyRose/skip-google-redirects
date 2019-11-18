
(function () {

    browser.storage.local
        .get("count")
        .then(function (result) {
            var count = (result && result.count) || 0;
            document.getElementById("redirect-count").textContent = count;
        });
    
})();
