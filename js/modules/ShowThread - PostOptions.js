var debug = false;
var postOptionsThreadRatingEnable = false;
var postOptionsPoTEnable = false;
var postOptionsPostsEnable = false;
var postOptionsThreadsEnable = false;
var pmChangesPMFromPostEnable = false;
var pmChangesPMFromPostShowQuote = false;
var pmChangesMessageConvo = true;
var annoyanceFixerFullScreenYoutubeEnable = false;
var annoyanceFixerShowBlockedPostsEnabled = false;
var annoyanceFixerHideBlockedPostsEnabled = false;
getPostOptions();

// Set vars equal to saved settings
function getPostOptions() {
    chrome.storage.sync.get("PostOptions", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "PostOptionsThreadRatingEnable": if (value) { postOptionsThreadRatingEnable = value }
                                break;
                            case "PostOptionsPoTEnable": if (value) { postOptionsPoTEnable = value }
                                break;
                            case "PostOptionsThreadsEnable": if (value) { postOptionsThreadsEnable = value }
                                break;
                            case "PostOptionsPostsEnable": if (value) { postOptionsPostsEnable = value }
                                break;
                            case "PMChangesPMFromPostEnable": if (value) { pmChangesPMFromPostEnable = value }
                                break;
                            case "PMChangesPMFromPostQuote": if (value) { pmChangesPMFromPostShowQuote = value }
                                break;
                            case "AnnoyanceFixerFullscreenYoutubeEnable": if (value) { annoyanceFixerFullScreenYoutubeEnable = value }
                                break;
                            case "AnnoyanceFixerShowBlockedPostsEnable": if (value) { annoyanceFixerShowBlockedPostsEnabled = value }
                                break;
                            case "AnnoyanceFixerHideBlockedPostsEnable": if (value) { annoyanceFixerHideBlockedPostsEnabled = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            enablePostOptions();
        }
    });
}

function enablePostOptions() {
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
                $(this).parent().closest('table').remove();
            });
        }
    }
    // Show Blocked Posts
    if (annoyanceFixerShowBlockedPostsEnabled) {
        if ($("a[onclick*='showIgnoredPost']").length >= 1) {
            $("a[onclick*='showIgnoredPost']").each(function (index) {
                // Hide Post
                this.click();
                // 'Ignored User' Alert
                $("a[onclick*='showIgnoredPost']:eq(" + index+")").closest('table').next().next().find(".float_left.smalltext")
                    .append($('<span>').text("(IGNORED USER)"));
                $("a[onclick*='showIgnoredPost']:eq(" + index + ")").closest('table').next().next().find(".tcat").css("background-color", "#c40d23");
            });
        }
    }
    // Remove default posts button
    $("#posts").find(".bitButton").each(function (index) {
        if ($(this).text() == "Find") {
            $(this).remove();
        }
    });
    // Loop through each post
    $("#posts > table").each(function (index) {
        // If post collapsed
        if (!$(this).find(".post_author > strong > span > a").attr('href') > 0)
            return true;
        var usernameUID = $(this).find(".post_author > strong > span > a").attr('href').replace(/\D/g, '');
        var usernameName = $(this).find(".post_author > strong > span > a").text();
        // Posts on Thread
        if (postOptionsPoTEnable) {
            var potLinkConst = "showthread.php?tid=" + threadID + "&mode=single&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title" : "Posts on Thread" , "href" : potLinkConst + usernameUID })
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
            var postLink;
            var myPostKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
            var threadTitle = $(".navigation").find(".active").text();
            // Include quote in message body
            var pmFromPostQuoteText = "";
            if (pmChangesPMFromPostShowQuote) {
                // Grab text of post (exclude quotes)
                pmFromPostQuoteText = $(this).find(".post_body").clone();
                if ($(this).find("blockquote")) {
                    pmFromPostQuoteText.find("blockquote").remove();
                }
                pmFromPostQuoteText = '[quote="' + usernameName + '"]' + pmFromPostQuoteText.text().replace(/\t+/g, "").replace(/\n\s*\n/g, '\n') + '[/quote]';
            }
            if (threadTitle.length > 50) {
                threadTitle = threadTitle.substring(0, 50);
            }
            var newPMButton = $("<a>")
                .attr({
                    "title": "PM From Post", "href": "javascript:void(0);",
                    "onclick": "javascript:document.getElementById('HFXPMFromPost"+index+"').style.display = " +
                        "(document.getElementById('HFXPMFromPost" + index + "').style.display == 'block') ? 'none' : 'block'",
                    "class" : "HFXPMFromPost"
                })
                .text("Quick PM")
                .css({ "cursor": "pointer"})
                .addClass("bitButton");
            // Replace PM button
            $(this).find(".bitButton[title='Send this user a private message']").replaceWith(newPMButton);

            // Get Post Link
            $(this).find(".smalltext > strong > a:eq(0)").each(function (index) {
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
            var spacing ='<br />';
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
            $(this).find("tbody:eq(0)").append($("<tr>").attr("id", "pmContainerRow" + index));
            $("#pmContainerRow" + index).append("<td>").addClass("trow1");
            $("#pmContainerRow" + index + " > td").append(finalform);
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