var s = document.createElement('script');

s.src = chrome.runtime.getURL('anilist/script.js');
s.onload = function() {
    this.remove();
};
setTimeout(() => {
    (document.head || document.documentElement).appendChild(s);
}, 3000)