var debug = false;
var enableForumRating = false;
var enableEnhancedSYT = false;
var enableHideClosed = false;
var enableHideForumRatings = false;
var enableInfiniScrollForums = true;
getForumRating();

// Set vars equal to saved settings
function getForumRating() {
    chrome.storage.sync.get("ForumChanges", function (data) {
        if (!chrome.runtime.error){
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "ForumChangesForumRatingEnabled": if (value) { enableForumRating = value; }
                                break;
                            case "ForumChangesEnhancedSYTEnabled": if (value) { enableEnhancedSYT = value; }
                                break;
                            case "ForumChangesHideClosedEnabled": if (value) { enableHideClosed = value; }
                                break;
                            case "ForumChangesHideForumRatingsEnabled": if (value) { enableHideForumRatings = value; }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })
                injectChanges();
            });
            
        }
    });
}

function injectChanges() {
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
    console.log(currentURL);
    /*
    var infScroll = new InfiniteScroll( '.container', {
        // defaults listed
      
        path: '',
        // REQUIRED. Determines the URL for the next page
        // Set to selector string to use the href of the next page's link
        // path: '.pagination__next'
        // Or set with {{#}} in place of the page number in the url
        // path: '/blog/page/{{#}}'
        // or set with function
        // path: function() {
        //   return return '/articles/P' + ( ( this.loadCount + 1 ) * 10 );
        // }
      
        append: undefined,
        // REQUIRED for appending content
        // Appends selected elements from loaded page to the container
      
        checkLastPage: true,
        // Checks if page has path selector element
        // Set to string if path is not set as selector string:
        //   checkLastPage: '.pagination__next'
      
        prefill: false,
        // Loads and appends pages on intialization until scroll requirement is met.
      
        responseType: 'document',
        // Sets the type of response returned by the page request.
        // Set to 'text' to return flat text for loading JSON.
      
        outlayer: false,
        // Integrates Masonry, Isotope or Packery
        // Appended items will be added to the layout
      
        scrollThreshold: 400,
        // Sets the distance between the viewport to scroll area
        // for scrollThreshold event to be triggered.
      
        elementScroll: false,
        // Sets scroller to an element for overflow element scrolling
      
        loadOnScroll: true,
        // Loads next page when scroll crosses over scrollThreshold
      
        history: 'replace',
        // Changes the browser history and URL.
        // Set to 'push' to use history.pushState()
        //    to create new history entries for each page change.
      
        historyTitle: true,
        // Updates the window title. Requires history enabled.
      
        hideNav: undefined,
        // Hides navigation element
      
        status: undefined,
        // Displays status elements indicating state of page loading:
        // .infinite-scroll-request, .infinite-scroll-load, .infinite-scroll-error
        // status: '.page-load-status'
      
        button: undefined,
        // Enables a button to load pages on click
        // button: '.load-next-button'
      
        onInit: undefined,
        // called on initialization
        // useful for binding events on init
        // onInit: function() {
        //   this.on( 'append', function() {...})
        // }
      
        debug: false,
        // Logs events and state changes to the console.
      })
      */
}

function injectForumRating() {
    // Credit: Emlybus
    var docSplit, tempString, i, currRate;
    docSplit = document.getElementById('content').innerHTML.split('\n');
    for (i = 0; i < docSplit.length; i++) {
        if (docSplit[i].indexOf('rating_table_') != -1) {
            currRate = docSplit[i].split('rating_table_')[1].split('">')[0].split('"')[0];
        } else if (docSplit[i].indexOf("Rating.build_forumdisplay") != -1) {
            tempString = docSplit[i].split("current_average: '")[1].split(" in")[0];
            if (tempString.indexOf("1 ") == 0) {
                tempString = tempString.replace("(s)", "");
            } else {
                tempString = tempString.replace("(s)", "s");
            }
            $('#rating_table_' + currRate).append('<span style="font-size: x-small;">' + tempString.replace(" - ", "<br>") + '</span>');
        }
    }
}

function injectEnhancedSYT() {
    // Credit: Xerotic
    if ($("input[name='author']").length > 0) {
        $("input[name='author']").clone().attr({"class": "textbox", "id": "author", "type": "text"}).insertAfter('input[name=author]').prev().remove();
    }

}

function injectHideClosed() {
    $("table").find("img").each(function (index) {
        if ($(this).attr("src").includes("lockfolder.gif")) {
            $(this).parent().parent().remove();
        }
    });
}

function injectHideForumRatings() {
    $("select[name='datecut']").closest('table').find("tr:eq(1) td:eq(2)").empty();
    // star_rating
    $("table").find(".star_rating").each(function (index) {
        $(this).parent().empty();
    });
}