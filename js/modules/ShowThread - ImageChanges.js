var maxSizeEnable = false;
var replaceBrokenEnable = false;
var forceHTTPSEnable = false; // eslint-disable-line
var brokenImageURL = chrome.extension.getURL('/images/icon128.png'); ;
getImageChanges();

// Set vars equal to saved settings
function getImageChanges () {
  chrome.storage.sync.get('ImageChanges', function (data) {
    if (!chrome.runtime.error) {
      $.each(data, function (index, data1) {
        $.each(data1, function (index1, data2) {
          $.each(data2, function (key, value) {
            switch (key) {
              case 'ImageChangesMaxSizeEnable': if (value) { maxSizeEnable = value; }
                break;
              case 'ImageChangesReplaceBrokenEnable': if (value) { replaceBrokenEnable = value; }
                break;
              case 'ImageChangesForceHTTPSEnable': if (value) { forceHTTPSEnable = value; }
                break;
              default: // console.log("ERROR: Key not found.");
                break;
            }
          });
        });
      });
      injectImageChanges();
    }
  });
}
function injectImageChanges () {
  // Loop through all images in posts
  $('.post_body').find('img').each(function (index) {
    // Max Size
    if (maxSizeEnable) {
      $(this).css({ 'max-width': '100%' });
    }
    // Replace Broken
    if (replaceBrokenEnable) {
      if ($(this).complete && $(this).naturalNeight !== 0) {
        this.src = brokenImageURL;
      }
    }
  });
}
