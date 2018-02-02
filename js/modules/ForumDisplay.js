var enableForumRating = false;
var enableEnhancedSYT = false;
var enableHideClosed = false;
var enableHideForumRatings = false;
getForumRating();

// Set vars equal to saved settings
function getForumRating () {
  chrome.storage.sync.get('ForumChanges', function (data) {
    if (!chrome.runtime.error) {
      $.each(data, function (index, data1) {
        $.each(data1, function (index1, data2) {
          $.each(data2, function (key, value) {
            switch (key) {
              case 'ForumChangesForumRatingEnabled': if (value) { enableForumRating = value; }
                break;
              case 'ForumChangesEnhancedSYTEnabled': if (value) { enableEnhancedSYT = value; }
                break;
              case 'ForumChangesHideClosedEnabled': if (value) { enableHideClosed = value; }
                break;
              case 'ForumChangesHideForumRatingsEnabled': if (value) { enableHideForumRatings = value; }
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
