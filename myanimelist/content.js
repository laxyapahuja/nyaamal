var s = document.createElement('script');
var s2 = document.createElement('script');

s.src = chrome.runtime.getURL('myanimelist/script.js');
s2.src = chrome.runtime.getURL('nyaa-scraper.js')
s2.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s2);
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);