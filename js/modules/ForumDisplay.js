var enableForumRating = true;
var enableEnhancedSYT = false;
var enableHideClosed = false;
var enableHideForumRatings = false;
var enableInfiniScrollForums = false;
getForumRating();

// Set vars equal to saved settings
function getForumRating () {
  chrome.storage.sync.get('ForumChanges', function (data) {
    if (!chrome.runtime.error) {
      $.each(data, function (index, data1) {
        $.each(data1, function (index1, data2) {
          $.each(data2, function (key, value) {
            if (typeof key === undefined || typeof value === undefined) { return; }
            switch (key) {
              case 'ForumChangesForumRatingEnabled': enableForumRating = value;
                break;
              case 'ForumChangesEnhancedSYTEnabled': enableEnhancedSYT = value;
                break;
              case 'ForumChangesHideClosedEnabled': enableHideClosed = value;
                break;
              case 'ForumChangesHideForumRatingsEnabled': enableHideForumRatings = value;
                break;
              case 'ForumChangesInfiniscrollForumsEnabled': enableInfiniScrollForums = value;
                break;
              default: // console.log("ERROR: Key not found.");
                break;
            }
          });
        });
        injectChanges();
      });
    }
  });
}

function injectChanges () {
  if (enableForumRating) {
    injectForumRating();
  }
  if (enableEnhancedSYT) {
    injectEnhancedSYT();
  }
  if (enableHideClosed) {
    injectHideClosed();
  }
  if (enableHideForumRatings) {
    injectHideForumRatings();
  }
  if (enableInfiniScrollForums){
    injectInfiniScrollForums();
  }
}

function injectInfiniScrollForums(){
  // Get current URL
  var currentURL = location.href;
  var pageStr = "&page=";
  if (currentURL.includes(pageStr)){
      var strIndex = currentURL.indexOf(pageStr) + pageStr.length;
      currentURL = currentURL.slice(0,strIndex);
  } else {
      currentURL = currentURL + pageStr;
  }

  //$('.go_page').after($('<button>').addClass('view-more-button'));
  var appendBody = $('#content > div > table.tborder.clear > tbody');
  var appendCount = 0;
  var warnUser = false;

  appendBody.infiniteScroll({
    // options: https://infinite-scroll.com/options.html
    path: '.pagination_next', // .pagination_next
    append: '.inline_row', // .inline_row
    checkLastPage: true, // true
    prefill: false, // false
    responseType: 'document',
    outlayer: false, // false
    scrollThreshold: 200, // 200
    elementScroll: false, // false
    loadOnScroll: true, // true
    history: 'push', // push
    historyTitle: true, // true
    hideNav: false, // .pagination
    status: '.page-load-status', // ?
    onInit: 
    function() {
       this.on( 'append', function() {
        // Incr Counts
        appendCount++;
        // Debug
        //console.log("Loop count: "+appendCount);
       });
     },
    debug: false, // false
  });
  var refreshId = setInterval(function() {
    // Debug
    //console.log("checking loaded pages..." + appendCount);
    // Warn
    if(appendCount > 1 && !warnUser){
      appendCount = 0;
      warnUser = true;
      window.alert("HFX Infiniscroll\n\n"+
        "Please refrain from infiniscrolling so fast.\n"+
        "If you continue to scroll faster than 2 pages every 5 seconds, this feature will automatically disable!");
    } 
    // Kill
    else if(appendCount > 1 && warnUser){
      appendCount = 0;
      window.alert("HFX Infiniscroll\n\n"+
        "You were warned... Killing Infiniscroll.\n"+
        "You left off on: "+ location.href);
        appendBody.infiniteScroll('destroy');
    }
    appendCount = 0;
  }, 5000);
}

function injectForumRating () {
  // Credit: Emlybus
  var docSplit, tempString, i, currRate;
  docSplit = document.getElementById('content').innerHTML.split('\n');
  for (i = 0; i < docSplit.length; i++) {
    if (docSplit[i].indexOf('rating_table_') !== -1) {
      currRate = docSplit[i].split('rating_table_')[1].split('">')[0].split('"')[0];
    } else if (docSplit[i].indexOf('Rating.build_forumdisplay') !== -1) {
      tempString = docSplit[i].split("current_average: '")[1].split(' in')[0];
      if (tempString.indexOf('1 ') === 0) {
        tempString = tempString.replace('(s)', '');
      } else {
        tempString = tempString.replace('(s)', 's');
      }
      $('#rating_table_' + currRate).append('<span style="font-size: x-small;">' + tempString.replace(' - ', '<br>') + '</span>');
    }
  }
}

function injectEnhancedSYT () {
  // Credit: Xerotic
  if ($("input[name='author']").length > 0) {
    $("input[name='author']").clone().attr({'class': 'textbox', 'id': 'author', 'type': 'text'}).insertAfter('input[name=author]').prev().remove();
  }
}

function injectHideClosed () {
  $('table').find('img').each(function (index) {
    if ($(this).attr('src').includes('lockfolder.gif')) {
      $(this).parent().parent().remove();
    }
  });
}

function injectHideForumRatings () {
  $("select[name='datecut']").closest('table').find('tr:eq(1) td:eq(2)').empty();
  // star_rating
  $('table').find('.star_rating').each(function (index) {
    $(this).parent().empty();
  });
}
