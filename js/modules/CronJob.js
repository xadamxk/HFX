var debug = false;
var enableBanAlert = true;
var banCSSBubble = {
  'border-radius': '5px',
  'border': '1px solid 888',
  'padding': '1px 4px 2px 4px',
  'background-color': '#ddd', // FA909E (Darker Pink) FDCBC7 (Light Pink) B6E5CB (Green) DDD (Light Gray)
  'color': '#000000',
  'font-size': '12px',
  'font-weight': 'bold',
  'cursor': 'pointer',
  'text-shadow': 'none'
};
if (debug){
  chrome.storage.sync.set({
    CronChanges: [{ 'ShsowTrollBan': true }]
  }, function () {
    // Save Confirmation
  });
}
getCronSettings();
function getCronSettings () {
  chrome.storage.sync.get('CronChanges', function (data) {
    if (!chrome.runtime.error) {
      $.each(data, function (index, data1) {
        $.each(data1, function (index1, data2) {
          $.each(data2, function (key, value) {
            if (typeof key === undefined || typeof value === undefined) { return; }
            switch (key) {
              case 'ShowTrollBan': enableBanAlert = value;
              default: // console.log("ERROR: Key not found.");
                //console.log(key);
                break;
            }
          });
        });
        
      });
    }
    injectCronChanges();
  });
  
}




function injectCronChanges() {
  if (enableBanAlert) {
    injectBanAlert();
  }
}

function injectBanAlert() {
  //
  if (getTrollDate()) {
    $("#content > .wrapper").prepend($("<div>").addClass("red_alert").addClass("HFXBanAlert")
    .append($("<div>").addClass("float_right")
    .append($("<a>").addClass("HFXBanAlertDismiss")
    .append($("<img>").attr('src', chrome.extension.getURL('/images/dismiss_notice.png')))))
      .append($("<strong>").text("Your forum account is currently banned."))
      .append(" Ban Reason: Sharing Accounts")
      .append("<br>")
      .append("Ban will be lifted: NEVER")
      .append("<br>")
      .append($("<a>").append($("<u>").text("For more information, please visit this page"))
          .attr("href","https://hackforums.net/showthread.php?tid=5817079")));
      $('.HFXBanAlertDismiss').click(function () {
        // Fadeout
        $('.HFXBanAlert').fadeOut('slow', function () {
        });
        // Save close
        chrome.storage.sync.set({
          CronChanges: [{ 'ShowTrollBan': false }]
        }, function () {
          // Save Confirmation
        });
      });
  }
}

function getTrollDate() {
  var test = false;
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  today = mm + '/' + dd + '/' + yyyy;

  // March 25 - April 1 2018
  if (((mm == 3 && dd > 24) || (mm == 4 && dd < 2) || test) && (yyyy == 2018)) {
    return true;
  }

  return false;
}

function doSelfBan(){
  // User gambles for trophy or self ban
  // 3-0-0 (odds: 1 in 5000 ban) Common
  // 7-0-0 (odds: 1 in 500 ban)
  // 14-0-0 (odds: 1 in 50 ban)
  // 0-3-0 (odds: 1 in 15 ban)
  // 0-6-0 (odds: 1 in 5 ban) Rare
  var postKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
  var result = $.ajax({
      method: "POST",
      url: "https://hackforums.net/selfban.php",
      dataType: "html",
      data: {
        "action": "do_selfban",
          "my_post_key": postKey,
          "uid": "",
          "bantime": "0-6-0",
          "submit": "Self Ban"
      },
      success: function (msg, statusText, jqhxr) {
          console.log("If you can see this, you lost the bet :(");
      }
  });
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