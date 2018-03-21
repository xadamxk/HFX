var debug = false;
var enableXMPP = false;

getXMPPSettings();

// Set vars equal to saved settings
function getXMPPSettings () {
  chrome.storage.sync.get('XMPPChanges', function (data) {
    if (!chrome.runtime.error) {
      $.each(data, function (index, data1) {
        $.each(data1, function (index1, data2) {
          $.each(data2, function (key, value) {
            if (typeof key === undefined || typeof value === undefined) { return; }
            switch (key) {
              case '': enableXMPP = value;
                break;
              default: // console.log("ERROR: Key not found.");
                //console.log(key);
                break;
            }
          });
        });
        
      });
      injectXMPPChanges();
    }
  });
}

function injectXMPPChanges () {
  if (enableXMPP) {
    injectXMPP();
  }
}

function injectXMPP(){
  //
  var converseCSS = chrome.extension.getURL("/css/converse.min.css");

  //$('head').append('<link ' + "href='" + converseCSS + "'" + 'rel="stylesheet" type="text/css">');
  $('head').append('<link ' + "href='https:\/\/cdn.conversejs.org\/css\/converse.min.css'" + 'rel="stylesheet" type="text/css">');


  $(".controlbox-head").css({
    'background-color': '#333 !important'
  });

  // Instantiate Converse
  converse.initialize({
    authentication: "login",
    auto_list_rooms: true,
    auto_join_rooms: [{'jid':'hackforums@im.hacker.im'}],
    //auto_login: true,
    auto_reconnect: true,
    //bosh_service_url: 'https://conversejs.org/http-bind/', // Please use this connection manager only for testing purposes
    default_domain: "hacker.im",
    debug: true,
    show_controlbox_by_default: false,
    muc_nickname_from_jid: true,
    websocket_url: 'https://hacker.im/xmpp-websocket'
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