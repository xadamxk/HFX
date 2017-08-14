console.log("HFX: HELLO WORLD");
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        console.log("This is a first install!");
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});
// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    suggest([
      {content: text + "SEARCH", description: "Search HF"},
      {content: text + "NEWS", description: "Browse the HF News"}
    ]);
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function (text) {
     uppcaseText = text.toUpperCase();
     console.log('Omnibox: ' + uppcaseText);
     switch (uppcaseText) {
        case 'SEARCH':
            navigate("www.hackforums.net/search.php");
            //
            break;
        case 'NEWS':
            console.log("news");
            //
            break;
        default:
            //
            window.alert("sometext");
            break;
    }
  });

function navigate(DestinationURL) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.update(tab.id, { url: DestinationURL });
    });
}