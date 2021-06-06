chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status == 'complete' && tab.url.match("/kitsu.io/anime/")) {
        inject(tabId);
    }
});

function inject(tabId) {
    chrome.tabs.executeScript(tabId, { file: "kitsu/script.js" })
}