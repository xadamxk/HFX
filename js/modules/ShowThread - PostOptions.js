var debug = false;
var postOptionsThreadRatingEnable = true;
var postOptionsPoTEnable = true;
var postOptionsPostsEnable = true;
var postOptionsThreadsEnable = true;
var pmChangesPMFromPostEnable = true;
var pmChangesPMFromPostShowQuote = true;
var pmChangesMessageConvo = false; // Disabled for production
var annoyanceFixerFullScreenYoutubeEnable = false;
var annoyanceFixerShowBlockedPostsEnabled = true;
var annoyanceFixerHideBlockedPostsEnabled = false;
var revertGreenUsernamesEnable = false;
var annoyanceFixerCollapseRelatedThreads = false;
var enableInfiniScrollThreads = false;
var annoyanceFixerUsersBrowsingToTop = false;
getPostOptions();

// Set vars equal to saved settings
function getPostOptions() {
    chrome.storage.sync.get("PostOptions", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        if (typeof key === undefined || typeof value === undefined) { return; }
                        switch (key) {
                            case "PostOptionsThreadRatingEnable": postOptionsThreadRatingEnable = value;
                                break;
                            case "PostOptionsPoTEnable": postOptionsPoTEnable = value;
                                break;
                            case "PostOptionsThreadsEnable": postOptionsThreadsEnable = value;
                                break;
                            case "PostOptionsPostsEnable": postOptionsPostsEnable = value;
                                break;
                            case "PMChangesPMFromPostEnable": pmChangesPMFromPostEnable = value;
                                break;
                            case "PMChangesPMFromPostQuote": pmChangesPMFromPostShowQuote = value;
                                break;
                            case "AnnoyanceFixerFullscreenYoutubeEnable": annoyanceFixerFullScreenYoutubeEnable = value;
                                break;
                            case "AnnoyanceFixerShowBlockedPostsEnable": annoyanceFixerShowBlockedPostsEnabled = value;
                                break;
                            case "AnnoyanceFixerHideBlockedPostsEnable": annoyanceFixerHideBlockedPostsEnabled = value;
                                break;
                            case "PostOptionsRevertGreenUsernames": revertGreenUsernamesEnable = value;
                                break;
                            case "AnnoyanceFixerCollapseRelatedThreads": annoyanceFixerCollapseRelatedThreads = value;
                                break;
                            case "PostOptionsInfiniscrollThreadEnable": enableInfiniScrollThreads = value;
                                break;
                            case "AnnoyanceFixerUsersBrowsingToTop": if (value) { annoyanceFixerUsersBrowsingToTop = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            injectPostOptions();
        }
    });
}

function injectPostOptions(){
    // Check Post Options while looping
    enablePostOptions();
    // Collapse Related Threads
    if (annoyanceFixerCollapseRelatedThreads){
        enableCollapseRelatedThreads();
    }
    // Infiniscroll Threads
    if (enableInfiniScrollThreads){
        injectInfiniScrollThreads();
    }

    if (annoyanceFixerUsersBrowsingToTop) {
        usersBrowsingToTop();
    }
    
}

function injectInfiniScrollThreads(){
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
  var appendBody = $('#posts');
  var appendCount = 0;
  var warnUser = false;

  appendBody.infiniteScroll({
    // options: https://infinite-scroll.com/options.html
    path: '.pagination_next', // .pagination_next
    append: '.post', // .inline_row
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

function enableCollapseRelatedThreads(){
    // PRT = Possibly Related Threads
    // Assets
    var collapseImg = chrome.extension.getURL("/images/collapse.gif");
    var collapseCollapsedImg = chrome.extension.getURL("/images/collapse_collapsed.gif");
    // PRT Table Title
    var prtTitle = $("strong:contains(Possibly Related Threads...)");
    // If Table exists
    if(prtTitle.length > 0){
        // PRT Table Rows
        var prtTableRows = prtTitle.parent().parent().siblings();
        // Hide by default
        prtTableRows.toggle();
        // Append Collapse Button
        prtTitle.parent().append($("<div>").addClass("expcolimage")
            .append("<img id='relatedThreadsCollapse' alt='[+]' title='[+]' style='cursor: pointer;' src='" + collapseCollapsedImg + "' />"));
        // Event Listener - Show/Hide
        $("#relatedThreadsCollapse").on("click", function () {
            // Toggle Table Content (Rows)
            prtTableRows.toggle();
            // Swap images
            togglePRTCollapseAttr(prtTableRows);
        });
    }
}

function enablePostOptions() {
    if (revertGreenUsernamesEnable) {
        $(".group23").each(function () {
            $(this).css("color", "#f9f9f9");
        });
    }
    // Get Postkey
    var myPostKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
    // Get Thread ID
    var threadID = "";
    $("input[type=hidden]").each(function () {
        if ($(this).attr("name") == "tid") {
            threadID = $(this).attr("value");
        }
    });
    // Show Thread Rating
    if (postOptionsThreadRatingEnable) {
        var docSplit, tempString, tempScore, i;
        if ($('.inline_rating').length > 0) {
            docSplit = document.getElementsByClassName("inline_rating")[0].innerHTML.split('\n');
            tempString = docSplit[2].split('>')[1].split('<')[0];
            tempScore = tempString.split(' - ')[1].split(' ')[0] + " Avg";
            tempString = tempString.split(' - ')[0];
            if (tempString.indexOf("1 Votes") == 0) {
                tempString = "1 Vote";
            }

            tempString = '<span style="font-size: x-small;">' + tempString + " - " + tempScore + '</span>';
            $(".inline_rating").append(tempString);
        }
    }
    // Hide Blocked Posts
    if (annoyanceFixerHideBlockedPostsEnabled) {
        if ($("a[onclick*='showIgnoredPost']").length >= 1) {
            $("a[onclick*='showIgnoredPost']").each(function () {
                // Remove Ignore Table
                $(this).parent().closest('.ignored_post').remove();
            });
        }
    }
    // Show Blocked Posts
    if (annoyanceFixerShowBlockedPostsEnabled) {
        if ($("a[onclick*='showIgnoredPost']").length >= 1) {
            // Load posts
            var posts = $("#posts");
            $("a[onclick*='showIgnoredPost']").each(function (index) {
                // Hide Post
                this.click();

                // Post ID
                var postID = $($("a[onclick*='showIgnoredPost']")[index]).attr("onclick").match(/\((.*)\)/)[1];
                
                // Get ignored users post
                var ignored_post = $(posts).find(`#post_${postID}`);
                
                // 'Ignored User' Alert
                ignored_post.find('.post_date').append("(IGNORED USER)").css("background-color", "#c40d23");
            });
        }
    }
    // Remove default posts button
    $(".post").find(".postbit_find").each(function (index) {
        if ($(this).text() == "Find") {
            $(this).remove();
        }
    });
    // Loop through each post
    $(".post").each(function (index) {
        //console.log($(this));
        // Post ID Selector
        var postIDSelector = $(this).find(".post_head > .float_right > strong > a:eq(0)");
        // If post collapsed
        if (!$(this).find(".author_information > strong > span > a").attr('href') > 0)
            return true;
        var usernameUID = $(this).find(".author_information > strong > span > a").attr('href').replace(/\D/g, '');
        var usernameName = $(this).find(".author_information > strong > span > a").text();
        // Posts on Thread
        if (postOptionsPoTEnable) {
            var potLinkConst = "showthread.php?tid=" + threadID + "&mode=single&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "Posts on Thread", "href": potLinkConst + usernameUID })
                .text("PoT")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton"));
        }
        // Threads
        if (postOptionsThreadsEnable) {
            const potLinkConst = "search.php?action=finduserthreads&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "User's Threads", "href": potLinkConst + usernameUID })
                .text("Threads")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton"));
        }
        // Posts
        if (postOptionsPostsEnable) {
            const potLinkConst = "search.php?action=finduser&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "User's Posts", "href": potLinkConst + usernameUID })
                .text("Posts")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton"));
        }
        // Message Convo
        if (pmChangesMessageConvo) {
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "Conversations", "value": usernameName })
                .text("Conversations")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton convoButton"));
        }
        // PM From Post
        if (pmChangesPMFromPostEnable) {
            // Check for PM button?
            var postLink;
            var threadTitle = $(".navigation").find(".active").text();
            // Include quote in message body
            var pmFromPostQuoteText = "";
            var pmFromPostQuotePID = "";
            if (pmChangesPMFromPostShowQuote) {
                // Grab PID of post
                $(postIDSelector).each(function (index) {
                    pmFromPostQuotePID = $(this).attr("href").substring($(this).attr("href").indexOf('#pid') + 4);
                });
                // Grab text of post (exclude quotes)
                pmFromPostQuoteText = $(this).find(".post_body").clone();
                if ($(this).find("blockquote")) {
                    pmFromPostQuoteText.find("blockquote").remove();
                }
                pmFromPostQuoteText = '[quote="' + usernameName + '" pid="' + pmFromPostQuotePID + '"]' + pmFromPostQuoteText.text().replace(/\t+/g, "").replace(/\n\s*\n/g, '\n') + '[/quote]';
            }
            if (threadTitle.length > 50) {
                threadTitle = threadTitle.substring(0, 50);
            }
            var newPMButton = $("<a>")
                .attr({
                    "title": "PM From Post", "href": "javascript:void(0);",
                    "onclick": "javascript:document.getElementById('HFXPMFromPost" + index + "').style.display = " +
                        "(document.getElementById('HFXPMFromPost" + index + "').style.display == 'block') ? 'none' : 'block'",
                    "class": "HFXPMFromPost"
                })
                .text("Quick PM")
                .css({ "cursor": "pointer" })
                .addClass("bitButton");
            // Replace PM button
            $(this).find(".postbit_pm[title='Send this user a private message']").replaceWith(newPMButton);

            // Get Post Link
            $(postIDSelector).each(function (index) {
                postLink = $(this).attr("href");
            });
            // HTML for PM Popup
            var formaction = '<div id="HFXPMFromPost' + index + '" class="HFXPMFromPostDiv" style="display:none;"><form action="private.php" ' +
                'method="post" name="input" target="_blank"><input type="hidden" name="action" value="do_send" />';
            var formpmid = '<input type="hidden" name="pmid" value="" />';
            var formdo = '<input type="hidden" name="do" value="" />';
            var formicon = '<input type="hidden" name="icon" value="" />';
            var formmy_post_key = '<input type="hidden" name="my_post_key" value="' + myPostKey + '" />';
            var formuid = '<input type="hidden" name="uid" value="' + usernameName + '" />';
            var formto = '<div align="center"><strong>Recipients: </strong><input type="text" class="textbox" name="to" id="to" ' +
                ' tabindex="3" value="' + usernameName + '" readonly />';
            var formsubject = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Subject: </strong><input type="text" class="textbox" ' +
                ' name="subject" size="40" maxlength="85" tabindex="3" value="Regarding Your Post: ' + threadTitle + '"/><br />';
            var formsend = '<input type="submit" class="button" name="submit" value="Send Message" tabindex="9" accesskey="s" />' +
                '<input type="submit" class="button" name="saveasdraft" value="Save as Draft" tabindex="10" />' +
                '<input type="submit" class="button" name="preview" value="Preview" tabindex="11" />';
            var formmessage = '<textarea name="message" rows="7" cols="90" tabindex="3" style="resize:vertical">' +
                '[size=x-small]Sent from [url=https://www.hackforums.net/' + postLink + ']your post[/url]. [/size]' +
                 pmFromPostQuoteText +
                '</textarea></div><br />';
            var formchecks = '<div align="center"><input type="checkbox" class="checkbox" name="options[signature]" value="1" tabindex="5" checked="checked" />' +
                'Signature - <input type="checkbox" class="checkbox" name="options[savecopy]" value="1" tabindex="7" checked="checked" />' +
                'Save a Copy - <input type="checkbox" class="checkbox" name="options[readreceipt]" value="1" tabindex="8" checked="checked" />Request Read Receipt</div><br />';
            var formsend = '<div align="center"><input type="submit" class="button PMFromPostButton sendQuickPM" name="submit" value="Send Message" tabindex="9" accesskey="s" />' +
                '<input type="submit" class="button PMFromPostButton" name="saveasdraft" value="Save as Draft" tabindex="10" />' +
                '<input type="submit" class="button PMFromPostButton" name="preview" value="Preview" tabindex="11" /></div><br />';
            var spacing = '<br />';
            var finalform = formaction + formpmid + formdo + formicon + formmy_post_key + formuid +
                spacing + formto + formsubject + spacing +
                formmessage + formchecks + formsend + '</form></div>';
            // CSS for PostFromPM Buttons
            $(".PMFromPostButton").css({ "margin-right": "5px" });
            // Append PostFromPM Popup - used to append under signature
            //$(this).find(".HFXPMFromPost").before(finalform);
            // CSS to highlight message popup
            $(".HFXPMFromPostDiv").css({ "background-color": "#3f3e3e" }); // 737272
            // Append to new row
            $(this).append($("<div>").attr("id", "pmContainerRow" + index));
            $("#pmContainerRow" + index).append("<div>");
            $("#pmContainerRow" + index + " > div").append(finalform);
            // Event Listener on send
            $(".sendQuickPM").click(function () {
                $("#pmContainerRow" + index).hide();
            });

        }
        // Fullscreen Youtube
        if (annoyanceFixerFullScreenYoutubeEnable) {
            $("iframe[src*=youtube]").each(function (index) {
                $(this).attr("allowfullscreen", "allowfullscreen");
            });
        }
    });
    // Conversation event handler
    $(".convoButton").click(function () {
        getPMConvoSearch($(this).attr("value"));
    });
}

function getPMConvoSearch(username) {
    // Get Postkey
    var postKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
    var result = $.ajax({
        method: "POST",
        url: "https://hackforums.net/private.php",
        dataType: "html",
        data: {
            "my_post_key": postKey,
            "action": "do_search",
            "keywords": "",
            "subject": "1",
            "message": "1",
            "sender": username,
            "status[new]": "1",
            "status[replied]": "1",
            "status[forwarded]": "1",
            "status[read]": "1",
            "folder[]": "All Folders",
            "sort": "dateline",
            "sortordr": "desc"
        },
        success: function (msg, statusText, jqhxr) {
            document.write(msg);
        }
    })
}

function togglePRTCollapseAttr(prtTableRows) {
    var collapseImg = chrome.extension.getURL("/images/collapse.gif");
    var collapseCollapsedImg = chrome.extension.getURL("/images/collapse_collapsed.gif");
    // Not visible
    if (!prtTableRows.is(':visible')) {
        $("#relatedThreadsCollapse").attr("alt", "[-]").attr("title", "[-]").attr("src", collapseImg);
    } else {
        $("#relatedThreadsCollapse").attr("alt", "[+]").attr("title", "[+]").attr("src", collapseCollapsedImg);
    }
}

function usersBrowsingToTop() {
    $(".smalltext").each(function() {
        if($(this).text().includes("Users browsing")) {
            $(this).clone().insertBefore($("#posts").closest("table"));
            $(this).remove();
        }
    });
}