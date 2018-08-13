var debug = false;
var enableMentions = true;

getMentionSettings();
function getMentionSettings () {
  chrome.storage.sync.get('MentionChanges', function (data) {
    if (!chrome.runtime.error) {
      $.each(data, function (index, data1) {
        $.each(data1, function (index1, data2) {
          $.each(data2, function (key, value) {
            if (typeof key === undefined || typeof value === undefined) { return; }
            switch (key) {
              case 'EnableMentions': enableMentions = value;
              default: // console.log("ERROR: Key not found.");
                //console.log(key);
                break;
            }
          });
        });
        
      });
    }
    injectMentionChanges();
  });
  
}




function injectMentionChanges() {
  scrapUsernameUID();
  if (enableMentions) {
    injectMentionAlert();
  }
}

function injectMentionAlert() {
  //

}

function scrapUsernameUID(){
  
}

function isFeatureEnabled(cat, option, cb) {
  let newstr;
  chrome.storage.sync.get(cat, function (data) {
    if (Object.keys(data).length > 0 && typeof data[cat] !== undefined) {
      for (let key in data[cat]) {
        if (data[cat][key].hasOwnProperty(option)) {
          return cb(data[cat][key][option]);
        }
      };
    }
    return cb(null);
  });
}