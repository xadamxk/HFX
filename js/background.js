console.log("HFX: HELLO WORLD");
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        console.log("This is a first install!");
        chrome.runtime.openOptionsPage();
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        var newURL = "https://github.com/xadamxk/HFX/wiki/Changelog";
        //chrome.tabs.create({ url: newURL });
    }
});

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    suggest([
      {content: text + "S", description: "Search HF"},
      { content: text + "N", description: "Browse the HF News" },
      { content: text + "L", description: "Browse the Lounge" }
    ]);
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function (text) {
     uppcaseText = text.toUpperCase();
     console.log('Omnibox: ' + uppcaseText);
     switch (uppcaseText) {
            // Awards
         case 'A':
         case 'AWARDS':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/myawards.php" });
             });
             break;
            // Bans
         case 'B':
         case 'BANS':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/bans.php" });
             });
             break;
             // Groups
         case 'G':
         case 'GROUPS':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/showgroups.php" });
             });
             break;
            // Help Docs
         case 'H':
         case 'HELP':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/misc.php?action=help" });
             });
             break;
            // Lounge
         case 'L':
         case 'LOUNGE':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/forumdisplay.php?fid=25" });
             });
             break;
             // Mods
         case 'M':
         case 'MODS':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/showmods.php" });
             });
             break;
            // News
         case 'N':
         case 'NEWS':
            chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                chrome.tabs.update(tab.id, { url: "https://hackforums.net/forumdisplay.php?fid=162" });
            });
            break;
             // Neg Rep Log
         case 'NEG':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/negreplog.php" });
             });
             break;
         // New Posts
         case 'NEW':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/search.php?action=getnew" });
             });
             break;
             // Search
         case 'S':
         case 'SEARCH':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/search.php" });
             });
             break;
             // Staff
         case 'STAFF':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/showstaff.php" });
             });
             break;
         // Stats
         case 'STATS':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/stats.php" });
             });
             break;
             // Tracking
         case 'T':
         case 'TRACK':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/private.php?action=tracking" });
             });
             break;
             // Warning Logs
         case 'W':
         case 'WARNING':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/warnlog.php" });
             });
             break;
             // HFX Thread
         case 'X':
         case 'HFX':
             chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                 chrome.tabs.update(tab.id, { url: "https://hackforums.net/showthread.php?tid=5696924" });
             });
             break;
        default:
            //
            window.alert("Command Not Found...");
            break;
    }
  });